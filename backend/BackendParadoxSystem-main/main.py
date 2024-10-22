import json
import tempfile
import time
from itertools import groupby
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
import mysql.connector as mariadb
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import subprocess
import uvicorn

app = FastAPI()
# Define a dictionary to store translations
translations = {
    "en": {
        "company_updated": "Company info successfully updated !",
        "kitchen_updated": "Kitchen updated successfully",
        "kitchen_exist":"kitchen already exists",
        "Kitche_add":"kitchen inserted successfully",
        "currency_exist":"Currency already exists",
        "currency_add":"Currency inserted successfully",
        "currency_updated":"Currency updated successfully",
        "branch_exist":"Branch already exists",
        "branch_add":"Branch added successfully"
    },
    "ar": {
        "company_updated": "تم تحديث معلومات الشركة بنجاح!",
        "kitchen_updated": "تم تحديث المطبخ بنجاح",
        "kitchen_exist" :"المطبخ موجود بالفعل",
        "Kitche_add":"تم إدخال المطبخ بنجاح",
        "currency_exist":"العملة موجودة بالفعل",
        "currency_add":"تم إدخال العملة بنجاح",
        "currency_updated": "تم تحديث العملة بنجاح",
        "branch_exist":"الفرع موجود بالفعل",
        "branch_add":"تمت إضافة الفرع بنجاح"
    }
}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
dbHost="80.81.158.76"
DATABASE_CONFIG = {
    "user": "root",
    "password": "Hkms0ft",
    "host": "80.81.158.76",
    "port": 9988,
}

def get_db(company_name: str):
    try:
        # Connect to the database using MySQL Connector/Python
        # connection = mariadb.connect(
        #     database=company_name,
        #     **DATABASE_CONFIG
        # )
        connection = mariadb.connect(user="root", password="Hkms0ft", host=dbHost,port=9988,database = company_name) 

        return connection
    except mariadb.Error as err:
        error_message = None
        if err.errno == mariadb.errorcode.ER_ACCESS_DENIED_ERROR:
            error_message = "Invalid credentials"
        elif err.errno == mariadb.errorcode.ER_BAD_DB_ERROR:
            error_message = "Company not found"
        else:
            error_message = "Internal Server Error"
        return error_message

@app.post("/pos/login")
async def login(request: Request):
    try:
        
        data = await request.json()
        username = data.get('username')
        password = data.get('password')
        company_name = data.get('company_name')

        user_query = (
            f"SELECT users.*, branch.* "
            f"FROM users "
            f"JOIN branch ON users.Branch = branch.Code "
            f"WHERE users.username = '{username}' AND users.password = '{password}'"
        )    
        print(company_name)
        # Establish the database connection
        conn = get_db(company_name)
        if isinstance(conn, str):  # Check if conn is an error message
            print("ana blll instanceeeeeeeee")
            return {"message": "Invalid Credentials"}  # Return the error message directly
        cursor = conn.cursor()
        cursor.execute(user_query)
        user = cursor.fetchone()
        print("useeeeeeeeer queryyyy", user)
        if not user:
            print("ana blll userrrrrrrrrrrrrrr ")
            return {"message": "Invalid Credentials"}
        # Get column names from cursor.description
        column_names = [desc[0] for desc in cursor.description]
        # Convert the list of tuples to a list of dictionaries
        user = dict(zip(column_names, user))
        comp_query = (f"Select company.Phone, company.Street, company.City, company.VAT, company.EndTime, company.FromDate,company.ToDate, currencies.Code from company join currencies on company.Currency = currencies.id ")
        cursor.execute(comp_query)
        comp = cursor.fetchone()
        column_names = [desc[0] for desc in cursor.description]
        comp = dict(zip(column_names, comp))

          

        # Check if the current date is within the range
        current_date = datetime.now()
        From_date = datetime.strptime(comp["FromDate"], "%Y-%m-%d")
        To_date = datetime.strptime(comp["ToDate"], "%Y-%m-%d")


        is_within_year = From_date <= current_date <= To_date
                
     
        
        accno = 53000101 if "USD" in comp["Code"] else 53000102
        comp["EndTime"] = comp["EndTime"] if comp["EndTime"] and comp["EndTime"].strip().lower() != "none" else "3:00"
        print("aefe", comp)
        return {"message": "Login successful", "user": user, "comp":comp, "accno":accno ,"is_within_year": is_within_year,"FromDate": comp["FromDate"],  "ToDate": comp["ToDate"]}
    except HTTPException as e:
        print("Validation error details:", e.detail)
        raise e
    finally:
        # The connection will be automatically closed when it goes out of scope
        pass

@app.get("/pos/users/{company_name}")
async def get_users(company_name: str):
    try:
        # Establish the database connection
        conn = get_db(company_name)
        cursor = conn.cursor()
        user_query = (
            f"SELECT * FROM users "
        )

        cursor.execute(user_query)
        users = cursor.fetchall()

        # Get column names from cursor.description
        column_names = [desc[0] for desc in cursor.description]

        # Convert the list of tuples to a list of dictionaries
        users_list = [dict(zip(column_names, user)) for user in users]
        return users_list
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        # The connection will be automatically closed when it goes out of scope
        pass


@app.get("/pos/getUserDetail/{company_name}/{username}")
async def get_user_detail(company_name: str, username: str):
    try:
        # Establish the database connection
        conn = get_db(company_name)
        cursor = conn.cursor()
        user_query = "SELECT * FROM users WHERE username=%s"
        cursor.execute(user_query, (username,))
        user = cursor.fetchone()
        # Convert the tuple to a dictionary
        user_dict = dict(zip(cursor.column_names, user))
         
        return user_dict
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        # The connection will be automatically closed when it goes out of scope
        pass


@app.post("/pos/users/{company_name}/{user_id}")
async def update_user(
        company_name: str,
        user_id: int,
        request: Request,
):
    conn = None
    try:
        # Check if the user exists in the given company
        conn = get_db(company_name)
        cursor = conn.cursor()

        # Check if the user exists
        user_query = "SELECT * FROM users WHERE id = %s"
        cursor.execute(user_query, (user_id,))
        user = cursor.fetchone()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        data = await request.json()
        if 'username' in data:
            data['username'] = data['username'].upper()

         # If you're using Description for UnitPrice, ensure to set it correctly
        if 'UnitPrice' in data:
            # Fetch the description for the given UnitPrice
            cursor.execute("SELECT Description FROM unitprice WHERE Code = %s", (data['UnitPrice'],))
            description = cursor.fetchone()
            if description:
                # If description exists, set it to the user update data
                data['Description'] = description[0]  # Assuming the description is in the first column
    
        # Construct the SQL update query
        update_query = f"UPDATE users SET {', '.join(f'{field} = %s' for field in data)} WHERE id = %s"
        update_values = list(data.values())
        update_values.append(user_id)

        # Execute the update query
        cursor.execute(update_query, tuple(update_values))

        # Commit the changes to the database
        conn.commit()

        return {"message": "User details updated successfully", "user": user}
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        if conn:
            conn.close()


import json

@app.get("/pos/company/{company_name}")
async def get_company(company_name: str):
    try:
        # Establish the database connection
        conn = get_db(company_name)
        cursor = conn.cursor()
        user_query = (
            f"SELECT * FROM company "
        )

        cursor.execute(user_query)
        comp = cursor.fetchone()
        if not comp:
            cursor.execute("INSERT INTO company (Name, Rate) VALUES (%s, %s)", (company_name, 89000))
            conn.commit()
        column_names = [desc[0] for desc in cursor.description]
        compOb = dict(zip(column_names, comp))
        currenciesquery = "Select * from currencies"
        cursor.execute(currenciesquery)
        allcur = cursor.fetchall()
        column_n = [desc[0] for desc in cursor.description]
        curOb = [dict(zip(column_n, cur)) for cur in allcur]
        print("compObbbbbbbbbbbbb", compOb)

        return {"compOb": compOb, "curOb": curOb}
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        # The connection will be automatically closed when it goes out of scope
        pass


@app.get("/pos/getCurr/{company_name}")
async def getCurr(company_name: str):
    try:
        # Establish the database connection
        conn = get_db(company_name)
        cursor = conn.cursor()
        cur_query = (
            f"SELECT * FROM company JOIN currencies ON currencies.id = company.Currency"
        )
        cursor.execute(cur_query)
        cur = cursor.fetchone()
        # Get column names from cursor.description
        column_names = [desc[0] for desc in cursor.description]
        compOb = dict(zip(column_names, cur))
        return compOb
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        # The connection will be automatically closed when it goes out of scope
        pass


from fastapi import HTTPException, Request


@app.post("/pos/updateCompany/{company_name}")
async def updateCompany(company_name: str, request: Request):
    # Get the language from the request headers or query parameters
    language = request.headers.get("Language", "en")
    try:
        conn = get_db(company_name)
        print("eeeeeeeeeeeeeeeeeee",)
        cursor = conn.cursor()
        data = await request.json()
        print("company dataaaaaaa", data)
        # Define the SQL query with placeholders (%s)
        sql_query = """
    UPDATE company SET 
        Name = %s, 
        Phone = %s, 
        Street = %s, 
        Branch = %s, 
        City = %s, 
        Currency = %s, 
        Name2 = %s, 
        `EndTime` = %s, 
        `Rate` = %s, 
        `KD` = %s, 
        `VAT` = %s, 
        `Pay` = %s,
        `FromDate` = %s,
        `ToDate` = %s
"""

# Assuming `data` contains the values to be updated and `company_id` is the unique identifier
        parameters = (
    data['Name'], data['Phone'], data['Street'], data['Branch'], 
    data['City'], data['Currency'], data['Name2'], data['EndTime'], 
    data['Rate'], data['KD'], data['VAT'], data["Pay"],  data['FromDate'],
    data['ToDate'],
)

        cursor.execute(sql_query, parameters)
        conn.commit()

        return JSONResponse(content={"message": translations[language]["company_updated"]}, media_type="application/json")
    except Exception as e:
        print("Error details:", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")
    finally:
        if conn:
            conn.close()


@app.post("/pos/addusers/{company_name}/{user_name}")
async def add_user(
        company_name: str,
        user_name: str,
        request: Request,
):
    conn = None
    try:
        # Check if the user exists in the given company
        conn = get_db(company_name)
        cursor = conn.cursor()

        # Check if the user exists
        user_query = f"SELECT * FROM users WHERE username = %s"

        cursor.execute(user_query, (user_name,))

        user = cursor.fetchone()
        if user is not None:
            return {"message": "User already exists"}
        user_name_uppercase = user_name.upper()

        # Get JSON data from request body
        data = await request.json()
        insert_query = f"INSERT INTO users(username, password, user_control, email, sales, sales_return, purshase, purshase_return, orders, trans, items, chart, statement, SAType, Branch, COH, EOD, RecallInv,TableUser,LockAfterDone,Pos,ManageItems,ManageGrpItems,InvHistory,DailySales,CashOnHands,Description,UnitPrice,EndshiftEod,EndShiftCOH,AddandupdateSection,AddandUpdateTable) VALUES (%s, %s,%s, %s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        cursor.execute(insert_query, (user_name_uppercase, '', '', '', "N", "N", "N", "N", "N", "N", "N", "N", "N", "SA", '', user_name_uppercase, "N", "N","N", "N","N", "N","N", "N","N", "N","UPrice","1","Y", "Y","Y", "Y"))

        # Commit the changes to the database
        conn.commit()

        return {"message": "User added successfully", "user": user_name_uppercase}
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        if conn:
            conn.close()

@app.get("/pos/categories/{company_name}")
async def get_categories(company_name: str):
    try:
        # Establish the database connection
        conn = get_db(company_name)
        cursor = conn.cursor()
        category_query = (
            f"SELECT * FROM groupitem WHERE GroupNo != 'MOD'"
        )

        cursor.execute(category_query)
        categories = cursor.fetchall()

        # Get column names from cursor.description
        column_names = [desc[0] for desc in cursor.description]

        # Convert the list of tuples to a list of dictionaries
        categories_list = [dict(zip(column_names, category)) for category in categories]
        return categories_list
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        # The connection will be automatically closed when it goes out of scope
        pass

# @app.get("/pos/allitems/{company_name}")
# async def get_allitems(company_name: str):
#     try:
#         # Establish the database connection
#         conn = get_db(company_name)
#         cursor = conn.cursor()
#         allitems_query = (
#             "SELECT * FROM items "
#             "WHERE GroupNo != 'MOD' AND Active = 'Y' "
#         )

#         cursor.execute(allitems_query)
#         allitems = cursor.fetchall()

#         # Get column names from cursor.description
#         column_names = [desc[0] for desc in cursor.description]

#         # Convert the list of tuples to a list of dictionaries
#         items_list = [dict(zip(column_names, allitem)) for allitem in allitems]
#         return items_list
#     except HTTPException as e:
#         print("Error details:", e.detail)
#         raise e
#     finally:
#         # The connection will be automatically closed when it goes out of scope
#         pass

@app.get("/pos/allitems/{company_name}/{username}")
async def get_allitems(company_name: str, username: str):
    try:
        # Establish the database connection
        conn = get_db(company_name)
        cursor = conn.cursor()

        # Get the user's description from the users table using username
        user_query = "SELECT Description FROM users WHERE Username = %s"
        cursor.execute(user_query, (username,))
        user_description = cursor.fetchone()

        if not user_description:
            raise HTTPException(status_code=404, detail="User not found")

        description = user_description[0]

        # Determine the Uprice column based on user description
        uprice_column = {
            "UPrice1": "UPrice1",
            "UPrice2": "UPrice2",
            "UPrice3": "UPrice3",
            "UPrice4": "UPrice4",
            "UPrice5": "UPrice5",
            "UPrice6": "UPrice6",
        }.get(description, "UPrice")  # Fallback to a default Uprice if none match

        # Build the query with dynamic Uprice column selection
        allitems_query = (
            f"SELECT *, {uprice_column} AS UPrice FROM items "
            "WHERE GroupNo != 'MOD' AND Active = 'Y'"
        )

        cursor.execute(allitems_query)
        allitems = cursor.fetchall()

        # Get column names from cursor.description
        column_names = [desc[0] for desc in cursor.description]

        # Convert the list of tuples to a list of dictionaries
        items_list = [dict(zip(column_names, allitem)) for allitem in allitems]
        return items_list
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    except Exception as e:
        print("An unexpected error occurred:", str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        # Ensure the cursor and connection are closed properly
        cursor.close()
        conn.close()

# @app.get("/pos/categoriesitems/{company_name}/{category_id}")
# async def get_itemsCategories(company_name: str, category_id: str):
#     try:
#         # Establish the database connection
#         conn = get_db(company_name)
#         cursor = conn.cursor()
#         categoryitems_query = (
#             "SELECT items.ItemNo, items.GroupNo, items.ItemName, items.Image, items.UPrice, items.Disc, items.Tax, items.KT1, items.KT2, items.KT3, items.KT4, items.Active "
#             "FROM items "
#             "INNER JOIN groupItem ON items.GroupNo = groupItem.GroupNo "
#             "WHERE groupItem.GroupNo=%s And items.Active = 'Y'"
#         )

#         cursor.execute(categoryitems_query, (category_id,))
#         categoriesitems = cursor.fetchall()

#         # Get column names from cursor.description
#         column_names = [desc[0] for desc in cursor.description]

#         # Convert the list of tuples to a list of dictionaries
#         categories_list = [dict(zip(column_names, categoryitem)) for categoryitem in categoriesitems]
#         return categories_list
#     except HTTPException as e:
#         print("Error details:", e.detail)
#         raise e
#     finally:
#         # The connection will be automatically closed when it goes out of scope
#         pass

@app.get("/pos/categoriesitems/{company_name}/{username}/{category_id}")
async def get_items_categories(company_name: str, username: str, category_id: str):
    conn = None
    cursor = None
    try:
        # Establish the database connection
        conn = get_db(company_name)
        cursor = conn.cursor()

        # Get the user's description from the users table using username
        cursor.execute("SELECT Description FROM users WHERE Username = %s", (username,))
        user_description = cursor.fetchone()

        if not user_description:
            raise HTTPException(status_code=404, detail="User not found")

        description = user_description[0]

        # Determine the Uprice column based on user description
        uprice_column = {
            "UPrice1": "UPrice1",
            "UPrice2": "UPrice2",
            "UPrice3": "UPrice3",
            "UPrice4": "UPrice4",
            "UPrice5": "UPrice5",
            "UPrice6": "UPrice6",
        }.get(description, "UPrice")  # Fallback to a default Uprice if none match

        # Build the query with dynamic Uprice column selection
        categoryitems_query = (
            f"SELECT items.ItemNo, items.GroupNo, items.ItemName, items.Image, "
            f"{uprice_column} AS UPrice, items.Disc, items.Tax, items.KT1, items.KT2, "
            f"items.KT3, items.KT4, items.Active "
            "FROM items "
            "INNER JOIN groupItem ON items.GroupNo = groupItem.GroupNo "
            "WHERE groupItem.GroupNo=%s AND items.Active = 'Y'"
        )

        cursor.execute(categoryitems_query, (category_id,))
        categoriesitems = cursor.fetchall()

        # Get column names from cursor.description
        column_names = [desc[0] for desc in cursor.description]

        # Convert the list of tuples to a list of dictionaries
        categories_list = [dict(zip(column_names, categoryitem)) for categoryitem in categoriesitems]
        return categories_list
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    except Exception as e:
        print("An unexpected error occurred:", str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        # Ensure the cursor and connection are closed properly
        if cursor:
            cursor.close()
        if conn:
            conn.close()



from collections import defaultdict

# @app.post("/pos/invoiceitem/{company_name}")
# async def post_invoiceitem(company_name: str, request: Request):
#     try:
#         # Establish the database connection
#         conn = get_db(company_name)
#         cursor = conn.cursor()
#         conn2 = get_db(company_name)
#         cursor2 = conn2.cursor()
#         conn3 = get_db(company_name)
#         cursor3 = conn3.cursor()
#         data = await request.json()
#         print("Adadaf", data)
#         items_by_kitchen = defaultdict(list)
#         print("closeeeeeeeeeeeeee", data["closeTClicked"])
#         if data["meals"] == []:
#             return {"message": "Invoice is empty"}
#         # Create a dictionary to store items grouped by kitchen code
#         # items_by_kitchen = defaultdict(list)
#         # Specify keys for grouping
        
#         if data["closeTClicked"]:
#             cursor2.execute(f"Select TableNo from inv Where InvNo = '{data['message']}' ")
#             tableno = cursor2.fetchone()  # Assuming you want to fetch one row
#             tableno = tableno[0]
#             cursor3.execute(f"Select OrderId from invnum Where InvNo = '{data['message']}' ")
#             orderId= cursor3.fetchone()[0]
            
#             print("tttttttttttttttttt", tableno)
#             cursor.execute(f"Update invnum set TableNo = '{tableno}' Where InvNo = '{data['message']}'")
#             cursor.execute(f"UPDATE tablesettings SET UsedBy='',InvNo=NULL, InvType=NULL WHERE TableNo='{tableno}'")
#             cursor.execute(f"Update inv set TableNo='', UsedBy='' Where InvNo='{data['message']}'")
#             for amount_data in data["selectedAmounts"]:    
#                 cursor.execute(
#                  "INSERT INTO paymentdetails (InvNo, Currency, Amount, PayType, PaymentMethod) VALUES (%s, %s, %s, %s, %s);",
#                  (
#                  data["message"],  # The invoice number, assuming 'inv_num' is already defined
#                  amount_data["currency"],  # Currency
#                  amount_data["amount"],  # Amount
#                  amount_data["payType"],  # PayType
#                  amount_data["paymentMethod"],  # PaymentMethod
#                   )
#                  )
#             # Update the invnum table
#             cursor.execute(
#                 "UPDATE invnum SET Date = %s, Time= %s, AccountNo = %s, CardNo = %s, Branch = %s, Disc = %s, Srv = %s, InvType=%s, RealDate=%s, RealTime=%s, OrderId=%s, User=%s, InvKind = %s, Tax = %s WHERE InvNo = %s;",
#                 (
#                     data["date"], data["time"], data["accno"], "cardno", data["branch"], data["discValue"], data["srv"],
#                     data["invType"], data["realDate"], data["time"], orderId, data["username"], data["invKind"], data["vat"], data['message']
#                 )
#             )

#             # Fetch invnum data
#             cursor.execute(
#                 "SELECT InvType, InvNo, Date, Time, AccountNo, CardNo, Branch, Disc, Srv, RealDate, RealTime, OrderId FROM invnum WHERE InvNo = %s;",
#                 (data['message'],))
#             invnum_data = cursor.fetchone()
#             conn.commit()
#             invnum_keys = ["InvType", "InvNo", "Date", "Time", "AccountNo", "CardNo", "Branch", "Disc", "Srv", "RealDate", "RealTime", "OrderId"]
#             invnum_dicts = dict(zip(invnum_keys, invnum_data))
#             return {"message": "Table closed", "invoiceDetails": invnum_dicts}

#         else:      
#             cursor.execute(f"Select KT, PrinterName from printers")
#             printer_data = cursor.fetchall()
#             printer_dic = {key: name for key, name in printer_data}
#             # Specify keys for grouping
#             keys_to_group_by = ['KT1', 'KT2', 'KT3', 'KT4']
#             inv_num = ''
#             order_id = ''
#             invoice_code = 1
#             accno = 1
#             # if data["renewInv"]:
#             #     print("anaaa fetertttttttttttt", data["message"])
#             #     cursor.execute(f"Select OrderId from invnum where InvNo = '{data["message"]}' ")
#             #     order_id = cursor.fetchone()
#             #     print("anaa honnnnnnnn", order_id)
#             #     cursor.execute(f"DELETE FROM inv WHERE InvNo = '{data["message"]}'")
#             if data['tableNo']:
#                 cursor.execute(f" Select InvNo from inv where tableNo = '{data['tableNo']}'  LIMIT 1")
#                 inv_row = cursor.fetchone()
#                 inv_num = inv_row[0]
#                 cursor.execute(f"Select OrderId from invnum where InvNo = '{inv_num}' ")
#                 order_id = cursor.fetchone()[0]
#                 cursor.execute(f"DELETE FROM inv WHERE InvNo = '{inv_num}'")   
#             # elif data["renewInv"]:
#             #     print("anaaa fetertttttttttttt", data["message"])
#             #     cursor.execute(f"Select OrderId from invnum where InvNo = '{data["message"]}' ")
#             #     order_id = cursor.fetchone()[0]
#             #     print("anaa honnnnnnnn", order_id)
#             #     cursor.execute(f"DELETE FROM inv WHERE InvNo = '{data["message"]}'")
#             else:
#                 cursor.execute(f"Insert into `order` () Values () ")
#                 order_id = cursor.lastrowid
#                 # Insert into invoices table
#                 cursor.execute(f"INSERT INTO invnum (OrderId, AccountNo) VALUES ({order_id}, {data['accno']}) ")
#                 # Get the last inserted invoice code
#                 invoice_code = cursor.lastrowid
#             if len(data["unsentMeals"]) == 0:
#                 return {"message": "The meals already sent to kitchen"}

#             # Group meals by printer names
#             for meal in data["unsentMeals"]:
#                 printer_names = [printer_dic.get(meal[kt_key], "") for kt_key in keys_to_group_by]
#                 # Remove dashes from printer names
#                 printer_names = [name.replace('-', '') for name in printer_names]
#                 non_empty_printer_names = [name for name in printer_names if name]  # Filter out empty strings
#                 if non_empty_printer_names:  # Check if there are non-empty printer names
#                     for kitchen in non_empty_printer_names:
#                         items_by_kitchen[kitchen].append(meal)

#             for item in data["meals"]:
#                 cursor.execute(
#                     "INSERT INTO inv (InvType, InvNo, ItemNo, Barcode, Branch, Qty, UPrice, Disc, Tax, GroupNo, KT1, KT2, KT3, KT4, TableNo,UsedBy ,Printed, `Index`) VALUES ( %s,%s, %s, %s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);",
#                     (
#                         data["invType"],  inv_num if data["tableNo"] else (data["message"] if data["renewInv"] else invoice_code), item["ItemNo"], "barc", data["branch"],
#                         item["quantity"], item["UPrice"],
#                         item["Disc"], item["Tax"], item["GroupNo"], item["KT1"], item["KT2"], item["KT3"], item["KT4"], data["tableNo"] if data["tableNo"] else  '','', 'p', item["index"], 
#                     )
#                 )

#                 if "chosenModifiers" in item and item["chosenModifiers"]:
#                     for chosenModifier in item["chosenModifiers"]:
#                         # Fetch the Disc, Tax, GroupNo, KT1, KT2, KT3, KT4 values from the items table
#                         cursor.execute("SELECT Disc, Tax, GroupNo, KT1, KT2, KT3, KT4 FROM items WHERE ItemNo = %s;",
#                                        (chosenModifier["ItemNo"],))
#                         result = cursor.fetchone()

#                         if result:
#                             disc, tax, group_no, kt1, kt2, kt3, kt4 = result

#                             # Continue with your INSERT statement using the fetched values
#                             cursor.execute(
#                                 "INSERT INTO inv (InvType, InvNo, ItemNo, Barcode, Branch, Qty, UPrice, Disc, Tax, GroupNo, KT1, KT2, KT3, KT4, TableNo,UsedBy ,Printed, `Index`) VALUES (%s,%s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);",
#                                 (
#                                     data["invType"], inv_num if data["tableNo"] else (data["message"] if data["renewInv"] else invoice_code), chosenModifier["ItemNo"], "barc",
#                                     data["branch"], item["quantity"],
#                                     item["UPrice"], disc, tax, group_no, kt1, kt2, kt3, kt4, data["tableNo"] if data["tableNo"] else  '','', 'p', item["index"],
#                                 )
#                             )
#             # Update the invnum table
#             print("ana nnnnnnnnnnnn")
#             for amount_data in data["selectedAmounts"]:    
#                 cursor.execute(
#                  "INSERT INTO paymentdetails (InvNo, Currency, Amount, PayType, PaymentMethod) VALUES (%s, %s, %s, %s, %s);",
#                  (
#                  inv_num if data["tableNo"] else (data["message"] if data["renewInv"] else invoice_code),  # The invoice number, assuming 'inv_num' is already defined
#                  amount_data["currency"],  # Currency
#                  amount_data["amount"],  # Amount
#                  amount_data["payType"],  # PayType
#                  amount_data["paymentMethod"],  # PaymentMethod
#                   )
#                  )
#             cursor.execute(
#                 "UPDATE invnum SET Date = %s, Time= %s, AccountNo = %s, CardNo = %s, Branch = %s, Disc = %s, Srv = %s, RealDate=%s, RealTime=%s, OrderId=%s, User=%s, InvType=%s, InvKind =%s, Tax = %s WHERE InvNo = %s;",
#                 (
#                     data["date"], data["time"], data["accno"], "cardno", data["branch"], data["discValue"], data["srv"], data["realDate"], data["time"], order_id, data["username"], data["invType"], data["invKind"], data["vat"], inv_num if data["tableNo"] else (data["message"] if data["renewInv"] else invoice_code)
#                 )
#             )

#             # Fetch invnum data
#             cursor.execute(
#                 "SELECT InvType, InvNo, Date, Time, AccountNo, CardNo, Branch, Disc, Srv, RealDate, RealTime, OrderId FROM invnum WHERE InvNo = %s;",
#                 (inv_num if data["tableNo"] else invoice_code,))
#             invnum_data = cursor.fetchone()
#             conn.commit()
#             invnum_keys = ["InvType", "InvNo", "Date", "Time", "AccountNo", "CardNo", "Branch", "Disc", "Srv", "RealDate", "RealTime", "OrderId"]
#             invnum_dicts = dict(zip(invnum_keys, invnum_data))
#             invnum_dicts["copiesKT"] = data["qtyPrintKT"]
#             if data["tableNo"]:
#                 # cursor.execute(f"Update tablesettings set UsedBy = '' Where TableNo = '{data['tableNo']}'")
#                 cursor.execute(
#                 "UPDATE tablesettings SET InvType = %s, InvNo = %s WHERE TableNo = %s",
#                 (data["invType"], inv_num if data["tableNo"] else (data["message"] if data["renewInv"] else invoice_code), data["tableNo"])
#                 )
#                 conn.commit()
#             return {"message": "Invoice items added successfully", "selectedData": items_by_kitchen, "invoiceDetails": invnum_dicts, }

#     except HTTPException as e:
#         print("Error details:", e.detail)
#         raise e
#     finally:
#         # The connection will be automatically closed when it goes out of scope
#         pass

@app.post("/pos/invoiceitem/{company_name}")
async def post_invoiceitem(company_name: str, request: Request):
    try:
        # Establish the database connection
        conn = get_db(company_name)
        cursor = conn.cursor()
        conn2 = get_db(company_name)
        cursor2 = conn2.cursor()
        conn3 = get_db(company_name)
        cursor3 = conn3.cursor()
        data = await request.json()
        print("Adadaf", data)
        items_by_kitchen = defaultdict(list)
        print("closeeeeeeeeeeeeee", data["closeTClicked"])
        if data["meals"] == []:
            return {"message": "Invoice is empty"}
        # Create a dictionary to store items grouped by kitchen code
        # items_by_kitchen = defaultdict(list)
        # Specify keys for grouping
        
        if data["closeTClicked"]:
            cursor2.execute(f"Select TableNo from tablesettings Where InvNo = '{data['message']}' ")
            tableno = cursor2.fetchone()  # Assuming you want to fetch one row
            tableno = tableno[0]
            cursor3.execute(f"Select OrderId from invnum Where InvNo = '{data['message']}' ")
            orderId= cursor3.fetchone()[0]
            
            print("tttttttttttttttttt", tableno)
            cursor.execute(f"Update invnum set TableNo = '{tableno}' Where InvNo = '{data['message']}'")
            cursor.execute(f"UPDATE tablesettings SET UsedBy='',InvNo=NULL, InvType=NULL WHERE TableNo='{tableno}'")
            cursor.execute(f"Update inv set UsedBy='' Where InvNo='{data['message']}'")
            for amount_data in data["selectedAmounts"]:    
                cursor.execute(
                 "INSERT INTO paymentdetails (InvNo, Currency, Amount, PayType, PaymentMethod) VALUES (%s, %s, %s, %s, %s);",
                 (
                 data["message"],  # The invoice number, assuming 'inv_num' is already defined
                 amount_data["currency"],  # Currency
                 amount_data["amount"],  # Amount
                 amount_data["payType"],  # PayType
                 amount_data["paymentMethod"],  # PaymentMethod
                  )
                 )
            # Update the invnum table
            cursor.execute(
                "UPDATE invnum SET Date = %s, Time= %s, AccountNo = %s, CardNo = %s, Branch = %s, Disc = %s, Srv = %s, InvType=%s, RealDate=%s, RealTime=%s, OrderId=%s, User=%s, InvKind = %s, Tax = %s WHERE InvNo = %s;",
                (
                    data["date"], data["time"], data["accno"], "cardno", data["branch"], data["discValue"], data["srv"],
                    data["invType"], data["realDate"], data["time"], orderId, data["username"], data["invKind"], data["vat"], data['message']
                )
            )

            # Fetch invnum data
            cursor.execute(
                "SELECT InvType, InvNo, Date, Time, AccountNo, CardNo, Branch, Disc, Srv, RealDate, RealTime, OrderId FROM invnum WHERE InvNo = %s;",
                (data['message'],))
            invnum_data = cursor.fetchone()
            conn.commit()
            invnum_keys = ["InvType", "InvNo", "Date", "Time", "AccountNo", "CardNo", "Branch", "Disc", "Srv", "RealDate", "RealTime", "OrderId"]
            invnum_dicts = dict(zip(invnum_keys, invnum_data))
            return {"message": "Table closed", "invoiceDetails": invnum_dicts}

        else:      
            cursor.execute(f"Select KT, PrinterName from printers")
            printer_data = cursor.fetchall()
            printer_dic = {key: name for key, name in printer_data}
            # Specify keys for grouping
            keys_to_group_by = ['KT1', 'KT2', 'KT3', 'KT4']
            inv_num = ''
            order_id = ''
            invoice_code = 1
            accno = 1
            # if data["renewInv"]:
            #     print("anaaa fetertttttttttttt", data["message"])
            #     cursor.execute(f"Select OrderId from invnum where InvNo = '{data["message"]}' ")
            #     order_id = cursor.fetchone()
            #     print("anaa honnnnnnnn", order_id)
            #     cursor.execute(f"DELETE FROM inv WHERE InvNo = '{data["message"]}'")
            if data['tableNo']:
                cursor.execute(f" Select InvNo from tablesettings where tableNo = '{data['tableNo']}'  LIMIT 1")
                inv_row = cursor.fetchone()
                inv_num = inv_row[0]
                cursor.execute(f"Select OrderId from invnum where InvNo = '{inv_num}' ")
                order_id = cursor.fetchone()[0]
                cursor.execute(f"DELETE FROM inv WHERE InvNo = '{inv_num}'")   
            # elif data["renewInv"]:
            #     print("anaaa fetertttttttttttt", data["message"])
            #     cursor.execute(f"Select OrderId from invnum where InvNo = '{data["message"]}' ")
            #     order_id = cursor.fetchone()[0]
            #     print("anaa honnnnnnnn", order_id)
            #     cursor.execute(f"DELETE FROM inv WHERE InvNo = '{data["message"]}'")
            else:
                cursor.execute(f"Insert into `order` () Values () ")
                order_id = cursor.lastrowid
                # Insert into invoices table
                cursor.execute(f"INSERT INTO invnum (OrderId, AccountNo) VALUES ({order_id}, {data['accno']}) ")
                # Get the last inserted invoice code
                invoice_code = cursor.lastrowid
            if len(data["unsentMeals"]) == 0:
                return {"message": "The meals already sent to kitchen"}

            # Group meals by printer names
            for meal in data["unsentMeals"]:
                printer_names = [printer_dic.get(meal[kt_key], "") for kt_key in keys_to_group_by]
                # Remove dashes from printer names
                printer_names = [name.replace('-', '') for name in printer_names]
                non_empty_printer_names = [name for name in printer_names if name]  # Filter out empty strings
                if non_empty_printer_names:  # Check if there are non-empty printer names
                    for kitchen in non_empty_printer_names:
                        items_by_kitchen[kitchen].append(meal)

            for item in data["meals"]:
                cursor.execute(
                    "INSERT INTO inv (InvType, InvNo, ItemNo, Barcode, Branch, Qty, UPrice, Disc, Tax, GroupNo, KT1, KT2, KT3, KT4 ,Printed, `Index`) VALUES ( %s, %s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);",
                    (
                        data["invType"],  inv_num if data["tableNo"] else (data["message"] if data["renewInv"] else invoice_code), item["ItemNo"], "barc", data["branch"],
                        item["quantity"], item["UPrice"],
                        item["Disc"], item["Tax"], item["GroupNo"], item["KT1"], item["KT2"], item["KT3"], item["KT4"], 'p', item["index"], 
                    )
                )

                if "chosenModifiers" in item and item["chosenModifiers"]:
                    for chosenModifier in item["chosenModifiers"]:
                        # Fetch the Disc, Tax, GroupNo, KT1, KT2, KT3, KT4 values from the items table
                        cursor.execute("SELECT Disc, Tax, GroupNo, KT1, KT2, KT3, KT4 FROM items WHERE ItemNo = %s;",
                                       (chosenModifier["ItemNo"],))
                        result = cursor.fetchone()

                        if result:
                            disc, tax, group_no, kt1, kt2, kt3, kt4 = result

                            # Continue with your INSERT statement using the fetched values
                            cursor.execute(
                                "INSERT INTO inv (InvType, InvNo, ItemNo, Barcode, Branch, Qty, UPrice, Disc, Tax, GroupNo, KT1, KT2, KT3, KT4,Printed, `Index`) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);",
                                (
                                    data["invType"], inv_num if data["tableNo"] else (data["message"] if data["renewInv"] else invoice_code), chosenModifier["ItemNo"], "barc",
                                    data["branch"], item["quantity"],
                                    item["UPrice"], disc, tax, group_no, kt1, kt2, kt3, kt4,'p', item["index"],
                                )
                            )
            # Update the invnum table
            print("ana nnnnnnnnnnnn")
            for amount_data in data["selectedAmounts"]:    
                cursor.execute(
                 "INSERT INTO paymentdetails (InvNo, Currency, Amount, PayType, PaymentMethod) VALUES (%s, %s, %s, %s, %s);",
                 (
                 inv_num if data["tableNo"] else (data["message"] if data["renewInv"] else invoice_code),  # The invoice number, assuming 'inv_num' is already defined
                 amount_data["currency"],  # Currency
                 amount_data["amount"],  # Amount
                 amount_data["payType"],  # PayType
                 amount_data["paymentMethod"],  # PaymentMethod
                  )
                 )
            cursor.execute(
                "UPDATE invnum SET Date = %s, Time= %s, AccountNo = %s, CardNo = %s, Branch = %s, Disc = %s, Srv = %s, RealDate=%s, RealTime=%s, OrderId=%s, User=%s, InvType=%s, InvKind =%s, Tax = %s WHERE InvNo = %s;",
                (
                    data["date"], data["time"], data["accno"], "cardno", data["branch"], data["discValue"], data["srv"], data["realDate"], data["time"], order_id, data["username"], data["invType"], data["invKind"], data["vat"], inv_num if data["tableNo"] else (data["message"] if data["renewInv"] else invoice_code)
                )
            )

            # Fetch invnum data
            cursor.execute(
                "SELECT InvType, InvNo, Date, Time, AccountNo, CardNo, Branch, Disc, Srv, RealDate, RealTime, OrderId FROM invnum WHERE InvNo = %s;",
                (inv_num if data["tableNo"] else invoice_code,))
            invnum_data = cursor.fetchone()
            conn.commit()
            invnum_keys = ["InvType", "InvNo", "Date", "Time", "AccountNo", "CardNo", "Branch", "Disc", "Srv", "RealDate", "RealTime", "OrderId"]
            invnum_dicts = dict(zip(invnum_keys, invnum_data))
            invnum_dicts["copiesKT"] = data["qtyPrintKT"]
            if data["tableNo"]:
                # cursor.execute(f"Update tablesettings set UsedBy = '' Where TableNo = '{data['tableNo']}'")
                cursor.execute(
                "UPDATE tablesettings SET InvType = %s, InvNo = %s WHERE TableNo = %s",
                (data["invType"], inv_num if data["tableNo"] else (data["message"] if data["renewInv"] else invoice_code), data["tableNo"])
                )
                conn.commit()
            return {"message": "Invoice items added successfully", "selectedData": items_by_kitchen, "invoiceDetails": invnum_dicts, }

    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        # The connection will be automatically closed when it goes out of scope
        pass



@app.get("/pos/getModifiers/{company_name}")
async def get_modifiers(company_name: str):
    try:
        # Establish the database connection
        conn = get_db(company_name)
        cursor = conn.cursor()
        modifieritems_query = (
            "SELECT ItemNo, ItemName, Image "
            "FROM items "
            "WHERE GroupNo=%s"
        )
        cursor.execute(modifieritems_query, ("MOD",))
        modifiersitems = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        modifiers_list = [dict(zip(column_names, modifyitem)) for modifyitem in modifiersitems]
        return modifiers_list
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        # The connection will be automatically closed when it goes out of scope
        pass

@app.get("/pos/getDailyItems/{company_name}/{current_date}")
async def getDailyItems(company_name: str, current_date:str):
    try:
        formatted_date = current_date.replace('.', '/')
        # Establish the database connection
        conn = get_db(company_name)
        cursor = conn.cursor()
        invnum_query = (
            "SELECT InvNo "
            "FROM invnum "
            "WHERE Date = %s;"
        )
        
        cursor.execute(invnum_query, (formatted_date,))
        invnum_results = cursor.fetchall()
        
        if not invnum_results:
            return []

        # Extract the InvNo values
        inv_nos = [row[0] for row in invnum_results]
        totalItem = f"((SUM(inv.Qty) * inv.UPrice * (1-inv.Disc/100)) * inv.Tax/100) + (SUM(inv.Qty) * inv.UPrice * (1-inv.Disc/100)) "

        # Step 3: Get the items grouped by ItemNo and filter by Active = 'Y' and join with groupitem table
        allitems_query = (
        f"""SELECT items.ItemNo, items.ItemName, items.UPrice, items.Disc, items.Tax, items.KT1, items.KT2, items.KT3, items.KT4, groupitem.GroupName, groupitem.GroupNo, 
               SUM(inv.Qty) AS TotalQty ,
               {totalItem} AS TotalItem 
        FROM items 
        LEFT JOIN groupitem ON items.GroupNo = groupitem.GroupNo 
        LEFT JOIN inv ON items.ItemNo = inv.ItemNo 
        WHERE items.Active = 'Y' AND inv.InvNo IN ({','.join(['%s'] * len(inv_nos))}) AND groupitem.GroupNo != 'MOD' 
         GROUP BY items.ItemNo;"""
        )
# Execute the query with item_nos as parameters
        cursor.execute(allitems_query, inv_nos)
        allitems = cursor.fetchall()

        # Get column names from cursor.description
        column_names = [desc[0] for desc in cursor.description]

        # Convert the list of tuples to a list of dictionaries
        items_list = [dict(zip(column_names, allitem)) for allitem in allitems]
        # Handle the case where GroupNo is still ''
        for item in items_list:
            if item['GroupNo'] == '':
                item['GroupName'] = ' '  # or any default value you want

        print("itemssssssssss", items_list)
        return items_list
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        # The connection will be automatically closed when it goes out of scope
        if conn:
            conn.close()


@app.get("/pos/allitemswithmod/{company_name}")
async def get_allitemswithmod(company_name: str):
    try:
        # Establish the database connection
        conn = get_db(company_name)
        cursor = conn.cursor()
        allitems_query = (
            "SELECT items.ItemNo, items.ItemName, items.Image, items.UPrice,items.UPrice1, items.UPrice2, items.UPrice3, items.UPrice4, items.UPrice5, items.UPrice6, items.Disc, items.Tax, items.KT1, items.KT2, items.KT3, items.KT4, items.Active, items.Ingredients, groupitem.GroupName, groupItem.GroupNo "
            "FROM items "
            "LEFT JOIN groupitem ON items.GroupNo = groupitem.GroupNo;"
        )

        cursor.execute(allitems_query)
        allitems = cursor.fetchall()

        # Get column names from cursor.description
        column_names = [desc[0] for desc in cursor.description]

        # Convert the list of tuples to a list of dictionaries
        items_list = [dict(zip(column_names, allitem)) for allitem in allitems]

        # Handle the case where GroupNo is still ''
        for item in items_list:
            if item['GroupNo'] == '':
                item['GroupName'] = ' '  # or any default value you want
        print("item list", items_list)
        return items_list
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        # The connection will be automatically closed when it goes out of scope
        if conn:
            conn.close()

@app.get("/pos/groupitems/{company_name}")
async def get_groupitems(company_name: str):
    try:
        # Establish the database connection
        conn = get_db(company_name)
        cursor = conn.cursor()
        allgroups_query = (
            "SELECT *  from groupitem "
        )

        cursor.execute(allgroups_query)
        allgroups = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        grps_list = [dict(zip(column_names, allgrp)) for allgrp in allgroups]
        return grps_list
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        # The connection will be automatically closed when it goes out of scope
        pass

from fastapi import HTTPException
import base64

@app.post("/pos/updateItems/{company_name}/{item_id}")
async def update_item(
        company_name: str,
        item_id: str,
        request: Request,
):
    conn = None
    try:
        # Check if the user exists in the given company
        conn = get_db(company_name)
        cursor = conn.cursor()

        # Get JSON data from request body
        item = await request.json()
        print("iteeeeeeeeeeeeee", item)
        print("handlee updateeeeeeee", item["existedImage"])
        # Check if the updated ItemNo already exists and is not the same as the original one
        existing_item_query = "SELECT ItemNo FROM items WHERE ItemNo = %s"
        cursor.execute(existing_item_query, (item["data"]["ItemNo"],))
        existing_item = cursor.fetchone()
        if existing_item is not None and item_id != item["data"]["ItemNo"]:
            return {"message":"ItemNo already exists. Please choose another ItemNo."}
        if "Image" in item["data"] and item["existedImage"] == 0:
            # Decode and save the image file
            image_data = base64.b64decode(item["data"]["Image"]["by"])
            image_name = item["data"]["Image"]["name"]
            with open(f"C:/scripts/qr/static/media/{company_name}/images/{image_name}", "wb") as image_file:
                image_file.write(image_data)
            # Update the data dict to only include the image file name
            item["data"]["Image"] = image_name
        elif "Image" in item["data"] and isinstance(item["data"]["Image"], dict) and item["existedImage"] == 1:
            item["data"]["Image"] = item["data"]["Image"]["name"]
        else:
            item["data"]["Image"] = item["data"]["Image"]
            # Update the data dict to only include the image file name
        # Construct the SQL update query dynamically based on the fields provided in the request
        update_query = (
            "UPDATE items SET "
            "ItemNo = %s, GroupNo = %s, ItemName = %s, "
            "Image = %s, UPrice = %s,UPrice1 = %s, UPrice2 = %s, UPrice3 = %s, UPrice4 = %s, UPrice5 = %s, UPrice6 = %s, Disc = %s, Tax = %s, KT1 = %s, KT2 = %s, KT3 = %s, KT4 = %s, Active = %s, Ingredients = %s "
            "WHERE ItemNo = %s"
        )
       # print("item data image", item["data"]["Image"])
        update_values = [
            item["data"]["ItemNo"],
            item["data"]["GroupNo"],
            item["data"]["ItemName"],
            item["data"]["Image"],
            item["data"]["UPrice"],
            item["data"]["UPrice1"],  # new field
            item["data"]["UPrice2"],  # new field
            item["data"]["UPrice3"],  # new field
            item["data"]["UPrice4"],  # new field
            item["data"]["UPrice5"],  # new field
            item["data"]["UPrice6"],  # new field
            item["data"]["Disc"],
            item["data"]["Tax"],
            item["data"]["KT1"],
            item["data"]["KT2"],
            item["data"]["KT3"],
            item["data"]["KT4"],
            item["data"]["Active"],
            item["data"]["Ingredients"],
            item_id
        ]
        update_inv_query = "UPDATE inv SET ItemNo = %s WHERE ItemNo = %s"
        cursor.execute(update_inv_query, (item["data"]["ItemNo"], item_id))

        # Commit the changes to the database
        conn.commit()

        # Execute the update query for items table
        cursor.execute(update_query, tuple(update_values))
        conn.commit()
        
        return {"message": "Item details updated successfully", "oldItemNo": item_id, "newItemNo": item["data"]["ItemNo"]}
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        if conn:
            conn.close()


@app.post("/pos/additems/{company_name}/{item_no}")
async def add_item(
        company_name: str,
        item_no: str,
        request: Request,
):
    conn = None
    try:
        # Check if the user exists in the given company
        conn = get_db(company_name)
        cursor = conn.cursor()

        # Check if the user exists
        addItem_query = f"SELECT * FROM items WHERE ItemNo = %s"

        cursor.execute(addItem_query, (item_no,))

        existItem = cursor.fetchone()
        if existItem is not None:
            return {"message": "Item already exists"}
        data = await request.json()
        insert_query = f"INSERT INTO items(ItemNo, GroupNo, ItemName, Image, UPrice, UPrice1, UPrice2, UPrice3, UPrice4, UPrice5, UPrice6, Disc, Tax, KT1, KT2, KT3, KT4, Active, Ingredients) VALUES (%s,%s,%s,%s,%s,%s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        cursor.execute(insert_query, (item_no, '', '', '', 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, '', '', '', '', 'Y', ''))
        conn.commit()
        return {"message": "Item added successfully", "item": item_no}
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        if conn:
            conn.close()

@app.get("/pos/getItemDetail/{company_name}/{item_no}")
async def get_item_detail(company_name: str, item_no: str):
    try:
        # Establish the database connection
        conn = get_db(company_name)
        cursor = conn.cursor()
        additem_query = (
            "SELECT items.ItemNo, items.ItemName, items.Image, items.UPrice,items.UPrice1, items.UPrice2, items.UPrice3, items.UPrice4, items.UPrice5, items.UPrice6, items.Disc, items.Tax, items.KT1, items.KT2, items.KT3, items.KT4, items.Active, items.Ingredients, groupitem.GroupName, groupitem.GroupNo "
            "FROM items "
            "LEFT JOIN groupitem ON items.GroupNo = groupitem.GroupNo "
            "WHERE items.ItemNo = %s;"
        )
        cursor.execute(additem_query, (item_no,))
        additem = cursor.fetchone()
        # Convert the tuple to a dictionary
        getadditem_dict = dict(zip(cursor.column_names, additem))

        return getadditem_dict
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        # The connection will be automatically closed when it goes out of scope
        if conn:
            conn.close()

@app.post("/pos/updateGroups/{company_name}/{group_id}")
async def updateGroups(
        company_name: str,
        group_id: str,
        request: Request,
):
    conn = None
    try:
        # Check if the user exists in the given company
        conn = get_db(company_name)
        cursor = conn.cursor()

        # Get JSON data from request body
        data = await request.json()
        print("Received data:", data)

        # Check if the updated ItemNo already exists and is not the same as the original one
        existing_group_query = "SELECT GroupNo FROM groupitem WHERE GroupNo = %s"
        cursor.execute(existing_group_query, (data["GroupNo"],))
        existing_item = cursor.fetchone()
        if existing_item is not None and group_id != data["GroupNo"]:
            return {"message":"GroupNo already exists. Please choose another GroupNo."}

        # Construct the SQL update query dynamically based on the fields provided in the request
        update_query = (
            "UPDATE groupitem SET "
            "GroupNo = %s, GroupName = %s, Image = %s "
            "WHERE GroupNo = %s"
        )
        update_values = [
            data["GroupNo"],
            data["GroupName"],
            data["Image"],
            group_id
        ]
        update_inv_query = "UPDATE inv SET GroupNo = %s WHERE GroupNo = %s"
        cursor.execute(update_inv_query, (data["GroupNo"], group_id))

        # Commit the changes to the database
        conn.commit()

        # Execute the update query for items table
        cursor.execute(update_query, tuple(update_values))
        conn.commit()
        return {"message": "Group details updated successfully", "oldItemNo": group_id, "newItemNo": data["GroupNo"]}
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        if conn:
            conn.close()


@app.post("/pos/addgroup/{company_name}/{group_no}")
async def addgroup(
        company_name: str,
        group_no: str,
        request: Request,
):
    conn = None
    try:
        # Check if the user exists in the given company
        conn = get_db(company_name)
        cursor = conn.cursor()

        # Check if the user exists
        addGroup_query = f"SELECT * FROM groupitem WHERE GroupNo = %s"

        cursor.execute(addGroup_query, (group_no,))

        existGroup = cursor.fetchone()
        if existGroup is not None:
            return {"message": "Group already exists"}
        data = await request.json()
        insert_query = f"INSERT INTO groupitem(GroupNo, GroupName, Image) VALUES (%s, %s, %s)"
        cursor.execute(insert_query, (group_no, '', ''))
        conn.commit()
        return {"message": "Group added successfully", "group": group_no}
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        if conn:
            conn.close()

@app.get("/pos/getGroupDetail/{company_name}/{group_no}")
async def get_item_detail(company_name: str, group_no: str):
    try:
        # Establish the database connection
        conn = get_db(company_name)
        cursor = conn.cursor()
        addgroup_query = (
            "SELECT GroupNo, GroupName, Image "
            "FROM groupitem "
            "WHERE GroupNo = %s;"
        )
        cursor.execute(addgroup_query, (group_no,))
        addgroup = cursor.fetchone()
        # Convert the tuple to a dictionary
        getaddgroup_dict = dict(zip(cursor.column_names, addgroup))

        return getaddgroup_dict
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        # The connection will be automatically closed when it goes out of scope
        if conn:
            conn.close()

@app.get("/pos/clients/{company_name}")
async def get_clients(company_name: str):
    try:
        # Establish the database connection
        conn = get_db(company_name)
        cursor = conn.cursor()
        allclients_query = (
            "SELECT * FROM clients "
        )

        cursor.execute(allclients_query)
        allclients = cursor.fetchall()

        # Get column names from cursor.description
        column_names = [desc[0] for desc in cursor.description]

        # Convert the list of tuples to a list of dictionaries
        clients_list = [dict(zip(column_names, client)) for client in allclients]
        return clients_list
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        # The connection will be automatically closed when it goes out of scope
        pass

@app.post("/pos/addclients/{company_name}/{user_name}")
async def add_client(
        company_name: str,
        user_name: str,
        request: Request,
):
    conn = None
    try:
        # Check if the user exists in the given company
        conn = get_db(company_name)
        cursor = conn.cursor()

        # Check if the user exists
        client_query = f"SELECT * FROM clients WHERE AccName = %s"

        cursor.execute(client_query, (user_name,))

        client = cursor.fetchone()
        if client is not None:
            return {"message": "Client already exists"}
        cursor.execute("SELECT COUNT(*) FROM clients")
        clients_count = cursor.fetchone()[0]
        if clients_count == 0:
            accno = 41100001
        else:     
            cursor.execute("SELECT AccNo FROM clients ORDER BY AccNo DESC LIMIT 1")
            lastAccNo = cursor.fetchone()
            if lastAccNo:
                lastAccNo = lastAccNo[0]
                accno = lastAccNo +1
        client_name_uppercase = user_name.upper()
        initial_insert_query = "INSERT INTO clients(AccNo, AccName, Address, Address2, Tel, Building, Street, Floor, Active, GAddress, Email, VAT, Region, AccPrice, AccGroup, AccDisc, AccRemark) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s , %s, %s, %s, %s , %s, %s, %s, %s)"
        cursor.execute(initial_insert_query, (accno, client_name_uppercase, '', '', '', '', '', '', 'Y', '', '', '', '', '', '', 0.0, ''))

        # Commit the changes to the database
        conn.commit()

        return {"message": "User added successfully", "user": client_name_uppercase}
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        if conn:
            conn.close()

@app.post("/pos/updateClients/{company_name}/{client_id}")
async def update_client(
        company_name: str,
        client_id: str,
        request: Request,
):
    conn = None
    try:
        # Check if the user exists in the given company
        conn = get_db(company_name)
        cursor = conn.cursor()

        # Check if the user exists
        user_query = "SELECT * FROM clients WHERE AccNo = %s"
        cursor.execute(user_query, (client_id,))
        user = cursor.fetchone()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        data = await request.json()
        update_query = (
            "UPDATE clients SET AccNo = %s, AccName = %s, Address = %s, "
            "Address2 = %s, Tel = %s, Building = %s, Street = %s, Floor = %s, Active = %s, GAddress = %s, Email = %s, VAT = %s, Region = %s, "
            "AccPrice = %s, AccGroup = %s, AccDisc = %s, AccRemark = %s   "
            "WHERE AccNo = %s"
        )
        update_values = [
            data["AccNo"],
            data["AccName"],
            data["Address"],
            data["Address2"],
            data["Tel"],
            data["Building"],
            data["Street"],
            data["Floor"],
            data["Active"],
            data["GAddress"],
            data["Email"],
            data["VAT"],
            data["Region"],
            data["AccPrice"],
            data["AccGroup"],
            data["AccDisc"],
            data["AccRemark"],
            client_id
        ]
        # Execute the update query
        cursor.execute(update_query, tuple(update_values))

        # Commit the changes to the database
        conn.commit()

        return {"message": "Client details updated successfully", "user": user}
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        if conn:
            conn.close()

@app.get("/pos/getClientDetail/{company_name}/{client_id}")
async def get_client_detail(company_name: str, client_id: str):
    try:
        # Establish the database connection
        conn = get_db(company_name)
        cursor = conn.cursor()
        user_query = "SELECT * FROM clients WHERE AccName=%s"
        cursor.execute(user_query, (client_id,))
        client = cursor.fetchone()
        user_dict = dict(zip(cursor.column_names, client))

        return user_dict
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        # The connection will be automatically closed when it goes out of scope
        pass

@app.get("/pos/allsections/{company_name}")
async def get_allsections(company_name: str):
    try:
        # Establish the database connection
        conn = get_db(company_name)
        cursor = conn.cursor()
        allitems_query = (
            "SELECT * FROM section "
        )

        cursor.execute(allitems_query)
        allsections = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        section_list = [dict(zip(column_names, section)) for section in allsections]
        return {"section_list": section_list}
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        # The connection will be automatically closed when it goes out of scope
        pass

@app.post("/pos/addsections/{company_name}")
async def add_section(
        company_name: str,
        request: Request,
):
    conn = None
    try:
        # Check if the user exists in the given company
        conn = get_db(company_name)
        cursor = conn.cursor()
        data = await request.json()

        # Check if the user exists
        check_section = f"SELECT * FROM section WHERE SectionNo = %s"
        cursor.execute(check_section, (data["SectionNo"],))
        section = cursor.fetchone()
        if section is not None:
            return {"message": "Section already exists"}
        section_uppercase = data["Name"].upper()
        # Perform the actual insert operation
        insert_query = f"INSERT INTO section(SectionNo, Name) VALUES (%s, %s)"
        cursor.execute(insert_query, (data["SectionNo"],section_uppercase, ))
        conn.commit()

        return {"message": "Section added successfully", }
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        if conn:
            conn.close()

@app.post("/pos/updateSections/{company_name}/{section_id}")
async def update_section(
        company_name: str,
        section_id: str,
        request: Request,
):
    conn = None
    try:
        # Check if the user exists in the given company
        conn = get_db(company_name)
        cursor = conn.cursor()

        # Get JSON data from request body
        data = await request.json()
        # Check if the updated ItemNo already exists and is not the same as the original one
        existing_item_query = "SELECT SectionNo FROM section WHERE SectionNo = %s"
        cursor.execute(existing_item_query, (data["SectionNo"],))
        existing_section = cursor.fetchone()
        if existing_section is not None and section_id != data["SectionNo"]:
            return {"message":"SectionNo already exists. Please choose another SectionNo."}

        # Construct the SQL update query dynamically based on the fields provided in the request
        update_query = (
            "UPDATE section SET "
            "SectionNo = %s, Name = %s "
            "WHERE SectionNo = %s"
        )
        update_values = [
            data["SectionNo"],
            data["Name"],
            section_id
        ]
        # Update the InvNo in the inv table after committing changes to items table
        update_table_query = "UPDATE tablesettings SET SectionNo = %s WHERE SectionNo = %s"
        cursor.execute(update_table_query, (data["SectionNo"], section_id))
        conn.commit()
        cursor.execute(update_query, tuple(update_values))
        conn.commit()
        return {"message": "Section updated successfully"}
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        if conn:
            conn.close()

@app.get("/pos/alltables/{company_name}/{sectionNo}")
async def get_alltables(company_name: str, sectionNo: str):
    try:
        # Establish the database connection
        conn = get_db(company_name)
        cursor = conn.cursor()
        if sectionNo:
            cursor.execute(
                f"SELECT * FROM tablesettings Where SectionNo = '{sectionNo}'"
            )
        else:
            cursor.execute("Select * from tablesettings")
        alltables = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        table_list = [dict(zip(column_names, table)) for table in alltables]
        return table_list
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        # The connection will be automatically closed when it goes out of scope
        pass

@app.post("/pos/addtables/{company_name}/{sectionNo}")
async def add_table(
        company_name: str,
        sectionNo: str,
        request: Request,
):
    conn = None
    try:
        # Check if the user exists in the given company
        conn = get_db(company_name)
        cursor = conn.cursor()
        data = await request.json()

        # Check if the user exists
        check_table = f"SELECT * FROM tablesettings WHERE TableNo = %s "

        cursor.execute(check_table, (data["TableNo"],))

        table = cursor.fetchone()
        if table is not None:
            return {"message": "Table already exists"}
        # Perform the actual insert operation
        insert_query = f"INSERT INTO tablesettings(TableNo, TableWaiter, SectionNo, Active, Description) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(insert_query, (data["TableNo"], data["TableWaiter"], sectionNo, data["Active"], data["Description"]))

        # Commit the changes to the database
        conn.commit()
        return {"message": "Table added successfully", }
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        if conn:
            conn.close()

@app.post("/pos/updateTables/{company_name}/{sectionNo}/{tableNo}")
async def update_table(
        company_name: str,
        sectionNo: str,
        tableNo: str,
        request: Request,
):
    conn = None
    try:
        # Check if the user exists in the given company
        conn = get_db(company_name)
        cursor = conn.cursor()
        data = await request.json()
        # Check if the updated ItemNo already exists and is not the same as the original one
        existing_table_query = "SELECT TableNo FROM tablesettings WHERE TableNo = %s "
        cursor.execute(existing_table_query, (data["TableNo"],))
        existing_table = cursor.fetchone()
        if existing_table is not None and tableNo != data["TableNo"]:
            return {"message":"Table No already exists. Please choose another Table No."}
        update_query = (
            "UPDATE tablesettings SET "
            "TableNo = %s, TableWaiter = %s, SectionNo = %s, Active = %s, Description = %s "
            "WHERE TableNo = %s AND SectionNo = %s "
        )
        update_values = [
            data["TableNo"],
            data["TableWaiter"],
            sectionNo,
            data["Active"],
            data["Description"],
            tableNo, sectionNo
        ]
        # Execute the update query for items table
        cursor.execute(update_query, tuple(update_values))
        conn.commit()
        return {"message": "Table updated successfully"}
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        if conn:
            conn.close()

@app.get("/pos/checkPermissionTable/{company_name}/{username}")
async def check_permissionTable(company_name: str, username: str):
    conn = None
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        
        # Query to get the permission for the given user
        cursor.execute("SELECT AddandUpdateTable FROM users WHERE username = %s", (username,))
        result = cursor.fetchone()
        
        if result:
            return {"AddandUpdateTable": result[0]}
        else:
            return {"AddandUpdateTable": "N"}  # Default to "N" if user not found
    except Exception as e:
        print("Error details:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        if conn:
            conn.close()

@app.get("/pos/checkPermissionSection/{company_name}/{username}")
async def check_permissionSection(company_name: str, username: str):
    conn = None
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        
        # Query to get the permission for the given user
        cursor.execute("SELECT AddandupdateSection FROM users WHERE username = %s", (username,))
        result = cursor.fetchone()
        
        if result:
            return {"AddandupdateSection": result[0]}
        else:
            return {"AddandupdateSection": "N"}  # Default to "N" if user not found
    except Exception as e:
        print("Error details:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        if conn:
            conn.close()

# @app.get("/pos/getInv/{company_name}/{tableNo}/{usedBy}")
# async def getInv(company_name: str, tableNo: str, usedBy: str):
#     conn = None
#     try:
#         conn = get_db(company_name)
#         cursor = conn.cursor()
#         # Check if the updated ItemNo already exists and is not the same as the original one
#         existing_table_query = """
#                     SELECT *
#                     FROM inv
#                     WHERE TableNo = %s LIMIT 1
#                 """
#         cursor.execute(existing_table_query, (tableNo,))
#         existing_table = cursor.fetchone()
#         # Get column names from cursor.description if result set exists
#         if existing_table:
#             column_names = [desc[0] for desc in cursor.description]
#             invNo = dict(zip(column_names, existing_table))
#             inv_No = invNo["InvNo"]
#             update_usedBy = "Update inv set UsedBy = %s where TableNo = %s "
#             update_values = [usedBy, tableNo]
#             cursor.execute(update_usedBy, tuple(update_values))
#             conn.commit()
#             cursor.execute(f"Select Disc, Srv from invnum where InvNo ='{inv_No}'")
#             result = cursor.fetchone()
#             disc, srv = result
#             cursor.execute(f"Update tablesettings set UsedBy = '{usedBy}' where TableNo = '{tableNo}'")
#             conn.commit()
#             cursor.execute(f" Select `Index` from inv where TableNo= '{tableNo}' Group By `Index` ")
#             extract_indexes = cursor.fetchall()

#             inv_list = []
#             if extract_indexes and extract_indexes[0][0] is not None:

#                 for e_index_row in extract_indexes:
#                     e_index = e_index_row[0]
#                     query = f" Select inv.*, items.ItemName from inv left join items on inv.ItemNo = items.ItemNo where inv.Index = {e_index} and inv.TableNo = '{tableNo}' and inv.GroupNo != 'MOD' "
#                     cursor.execute(query)
#                     princ_items = cursor.fetchone()
#                     column_names = [desc[0] for desc in cursor.description]
#                     princ_item = dict(zip(column_names, princ_items))
#                     query2 = f" Select inv.*, items.ItemName from inv left join items on inv.ItemNo = items.ItemNo Where inv.TableNo = '{tableNo}' and inv.Index = {e_index} and inv.GroupNo = 'MOD' "
#                     cursor.execute(query2)
#                     item_mods = cursor.fetchall()
#                     column_names = [desc[0] for desc in cursor.description]
#                     item_mod = [dict(zip(column_names, imod)) for imod in item_mods]
#                     item = {
#                         "ItemNo": princ_item["ItemNo"],
#                         "ItemName": princ_item["ItemName"],
#                         "Printed": princ_item["Printed"],
#                         "UPrice": princ_item["UPrice"],
#                         "Disc": princ_item["Disc"],
#                         "Tax": princ_item["Tax"],
#                         "quantity": princ_item["Qty"],
#                         "KT1": princ_item["KT1"],
#                         "KT2": princ_item["KT2"],
#                         "KT3": princ_item["KT3"],
#                         "KT4": princ_item["KT4"],
#                         "index": princ_item["Index"],
#                         "GroupNo": princ_item["GroupNo"],
#                         "chosenModifiers": [
#                             {"ItemNo": itemod["ItemNo"], "ItemName": itemod["ItemName"]}
#                             for itemod in item_mod
#                         ]
#                     }
#                     inv_list.append(item)
#                 return {"inv_list": inv_list, "invNo": inv_No, "disc": disc, "srv": srv }
#         return {"message": "there are no items"}
#     except HTTPException as e:
#         print("Error details:", e.detail)
#         raise e
#     finally:
#         if conn:
#             conn.close()


@app.get("/pos/getInv/{company_name}/{tableNo}/{usedBy}")
async def getInv(company_name: str, tableNo: str, usedBy: str):
    conn = None
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()

        # Query to get the corresponding invoice based on TableNo from tablesettings
        existing_table_query = """
            SELECT inv.*, tablesettings.TableNo
            FROM inv
            JOIN tablesettings 
                ON inv.InvNo = tablesettings.InvNo 
                AND inv.InvType = tablesettings.InvType
            WHERE tablesettings.TableNo = %s
            LIMIT 1;
        """
        cursor.execute(existing_table_query, (tableNo,))
        existing_table = cursor.fetchone()

        # Get column names from cursor.description if result set exists
        if existing_table:
            column_names = [desc[0] for desc in cursor.description]
            invNo = dict(zip(column_names, existing_table))
            inv_No = invNo["InvNo"]

            # Update UsedBy in the inv table
            update_usedBy = "UPDATE inv SET UsedBy = %s WHERE InvNo = %s"
            update_values = [usedBy, inv_No]
            cursor.execute(update_usedBy, tuple(update_values))
            conn.commit()

            # Fetch Disc and Srv from invnum using InvNo
            cursor.execute(f"SELECT Disc, Srv FROM invnum WHERE InvNo = %s", (inv_No,))
            result = cursor.fetchone()
            disc, srv = result

            # Update UsedBy in tablesettings using TableNo
            cursor.execute(f"UPDATE tablesettings SET UsedBy = %s WHERE TableNo = %s", (usedBy, tableNo))
            conn.commit()

            # Fetch Index from inv table using InvNo
            cursor.execute(f"SELECT `Index` FROM inv WHERE InvNo = %s GROUP BY `Index`", (inv_No,))
            extract_indexes = cursor.fetchall()

            inv_list = []
            if extract_indexes and extract_indexes[0][0] is not None:
                for e_index_row in extract_indexes:
                    e_index = e_index_row[0]

                    # Query principal items using InvNo and Index
                    query = f"""
                        SELECT inv.*, items.ItemName
                        FROM inv
                        LEFT JOIN items ON inv.ItemNo = items.ItemNo
                        WHERE inv.Index = %s AND inv.InvNo = %s AND inv.GroupNo != 'MOD'
                    """
                    cursor.execute(query, (e_index, inv_No))
                    princ_items = cursor.fetchone()

                    column_names = [desc[0] for desc in cursor.description]
                    princ_item = dict(zip(column_names, princ_items))

                    # Query modifiers using InvNo and Index
                    query2 = f"""
                        SELECT inv.*, items.ItemName
                        FROM inv
                        LEFT JOIN items ON inv.ItemNo = items.ItemNo
                        WHERE inv.InvNo = %s AND inv.Index = %s AND inv.GroupNo = 'MOD'
                    """
                    cursor.execute(query2, (inv_No, e_index))
                    item_mods = cursor.fetchall()

                    column_names = [desc[0] for desc in cursor.description]
                    item_mod = [dict(zip(column_names, imod)) for imod in item_mods]

                    item = {
                        "ItemNo": princ_item["ItemNo"],
                        "ItemName": princ_item["ItemName"],
                        "Printed": princ_item["Printed"],
                        "UPrice": princ_item["UPrice"],
                        "Disc": princ_item["Disc"],
                        "Tax": princ_item["Tax"],
                        "quantity": princ_item["Qty"],
                        "KT1": princ_item["KT1"],
                        "KT2": princ_item["KT2"],
                        "KT3": princ_item["KT3"],
                        "KT4": princ_item["KT4"],
                        "index": princ_item["Index"],
                        "GroupNo": princ_item["GroupNo"],
                        "chosenModifiers": [
                            {"ItemNo": itemod["ItemNo"], "ItemName": itemod["ItemName"]}
                            for itemod in item_mod
                        ]
                    }
                    inv_list.append(item)

                return {"inv_list": inv_list, "invNo": inv_No, "disc": disc, "srv": srv }

        return {"message": "there are no items"}

    except HTTPException as e:
        print("Error details:", e.detail)
        raise e

    finally:
        if conn:
            conn.close()




# @app.post("/insertInv/{company_name}/{tableNo}/{usedBy}")
# async def insertInv(company_name: str, tableNo: str, usedBy: str, request: Request):
#     conn = None
#     try:
#         conn = get_db(company_name)
#         cursor = conn.cursor()
#
#         cursor.execute(f" Select InvNo from inv where tableNo = '{tableNo}'  LIMIT 1")
#         inv_row = cursor.fetchone()
#         data = await request.json()
#         meals = data['meals']
#         if(inv_row):
#             inv_num = inv_row[0]
#             if (inv_num is not None):
#                 cursor.execute(f"DELETE FROM inv WHERE InvNo = '{inv_num}'")
#                 for item in meals:
#                     cursor.execute(
#                         "INSERT INTO inv (InvType, InvNo, ItemNo, Barcode, Branch, Qty, UPrice, Disc, Tax, GroupNo, KT1, KT2, KT3, KT4, TableNo, UsedBy, Printed, `Index`) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);",
#                         (
#                             data["invType"], inv_num, item["ItemNo"], "barc", data["branch"],
#                             item["quantity"], item["UPrice"],
#                             item["Disc"], item["Tax"], item["GroupNo"], item["KT1"], item["KT2"], item["KT3"],
#                             item["KT4"],
#                             tableNo, "", "p", item["index"])
#                     )
#                     if "chosenModifiers" in item and item["chosenModifiers"]:
#                         for chosenModifier in item["chosenModifiers"]:
#                             # Fetch the Disc, Tax, GroupNo, KT1, KT2, KT3, KT4 values from the items table
#                             cursor.execute(
#                                 "SELECT Disc, Tax, GroupNo, KT1, KT2, KT3, KT4 FROM items WHERE ItemNo = %s;",
#                                 (chosenModifier["ItemNo"],))
#                             result = cursor.fetchone()
#
#                             if result:
#                                 disc, tax, group_no, kt1, kt2, kt3, kt4 = result
#                                 cursor.execute(
#                                     "INSERT INTO inv (InvType, InvNo, ItemNo, Barcode, Branch, Qty, UPrice, Disc, Tax, GroupNo, KT1, KT2, KT3, KT4, TableNo, UsedBy, Printed, `Index`) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);",
#                                     (
#                                         data["invType"], inv_num, chosenModifier["ItemNo"], "barc",
#                                         data["branch"], item["quantity"],
#                                         item["UPrice"], disc, tax, group_no, kt1, kt2, kt3, kt4, tableNo, "", "p",
#                                         item["index"]
#                                     )
#                                 )
#                 # Commit the transaction
#                 cursor.execute(
#                     f"UPDATE invnum SET InvType = '{data['invType']}', Date = '{data["date"]}', Time='{data["time"]}', AccountNo = 'accno', CardNo = 'cardno', Branch = '{data['branch']}', Disc = '{data['discValue']}', Srv = '{data['srv']}' WHERE InvNo = '{inv_num}'"
#                 )
#                 cursor.execute(f"Update tablesettings set UsedBy = '' Where TableNo = '{tableNo}'")
#                 conn.commit()
#                 return {"invNo": inv_num}
#     except HTTPException as e:
#         print("Error details:", e.detail)
#         raise e
#     finally:
#         if conn:
#             conn.close()

@app.get("/pos/chooseAccess/{company_name}/{tableNo}/{loggedUser}")
async def chooseAccess(company_name: str, tableNo: str, loggedUser: str):
    try:
        # Establish the database connection
        conn = get_db(company_name)
        cursor = conn.cursor()

        # Check the tablesettings for the specific table number
        settings_query = f"SELECT UsedBy FROM tablesettings WHERE TableNo = '{tableNo}' LIMIT 1"
        cursor.execute(settings_query)
        settings_fetch = cursor.fetchone()

        if settings_fetch:
            used_by = settings_fetch[0]

            # Check if the table is used by another user
            if used_by and used_by != loggedUser:
                # Check if the loggedUser can access all tables
                permission_query = f"SELECT TableUser FROM users WHERE Username = '{loggedUser}' LIMIT 1"
                cursor.execute(permission_query)
                user_permission = cursor.fetchone()

                if user_permission and user_permission[0] == "Y":
                    return {"message": "you can access this table", "usedBy": used_by}
                else:
                    return {"message": "you can't access this table, you don't have permission", "usedBy": used_by}
            elif used_by == loggedUser:
                return {"message": "you can access this table", "usedBy": used_by}

        return {"message": "you can access this table", "usedBy": ""}
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        # The connection will be automatically closed when it goes out of scope
        pass

# @app.get("/pos/chooseAccess/{company_name}/{tableNo}/{loggedUser}")
# async def chooseAccess(company_name: str, tableNo: str, loggedUser: str):
#     try:
#         # Establish the database connection
#         conn = get_db(company_name)
#         cursor = conn.cursor()

#         # Check the inv table for the specific table number
#         tableNo_query = f"SELECT * FROM inv WHERE TableNo = '{tableNo}' LIMIT 1"
#         cursor.execute(tableNo_query)
#         tableNo_fetch = cursor.fetchone()

#         if tableNo_fetch:
#             column_names = [desc[0] for desc in cursor.description]
#             row_dict = dict(zip(column_names, tableNo_fetch))

#             # Check if the table is used by another user
#             if row_dict["UsedBy"] != "" and row_dict["UsedBy"] != loggedUser:
#                 # Check if the loggedUser can access all tables
#                 permission_query = f"SELECT TableUser FROM users WHERE Username = '{loggedUser}' LIMIT 1"
#                 cursor.execute(permission_query)
#                 user_permission = cursor.fetchone()

#                 if user_permission and user_permission[0] == "Y":
#                     return {"message": "you can access this table", "usedBy": row_dict["UsedBy"]}
#                 else:
#                     return {"message": "you can't access this table, you don't have permission", "usedBy": row_dict["UsedBy"]}
#             elif row_dict["UsedBy"] != "" and row_dict["UsedBy"] == loggedUser:
#                 return {"message": "you can access this table", "usedBy": row_dict["UsedBy"], "invNo": tableNo_fetch[1]}
        
#         return {"message": "you can access this table", "usedBy": ""}
#     except HTTPException as e:
#         print("Error details:", e.detail)
#         raise e
#     finally:
#         # The connection will be automatically closed when it goes out of scope
#         pass

# @app.get("/pos/chooseAccess/{company_name}/{tableNo}/{loggedUser}")
# async def chooseAccess(company_name: str, tableNo: str, loggedUser: str):
#     try:
#         # Establish the database connection
#         conn = get_db(company_name)
#         cursor = conn.cursor()
#         tableNo_query = (
#             f"SELECT * FROM inv Where TableNo = '{tableNo}' Limit 1 "
#         )

#         cursor.execute(tableNo_query)
#         tableNo_fetch = cursor.fetchone()
#         if(tableNo_fetch):
#             column_names = [desc[0] for desc in cursor.description]
#             row_dict = dict(zip(column_names, tableNo_fetch))
#             if row_dict["UsedBy"] != "" and row_dict["UsedBy"] != loggedUser:
#                 return {"message": "you can't access this table right now", "usedBy": row_dict["UsedBy"]}
#             elif row_dict["UsedBy"] != "" and row_dict["UsedBy"] == loggedUser:
#                 return {"message": "you can access this table", "usedBy": row_dict["UsedBy"], "invNo": tableNo_fetch[1]}
#         return {"message": "you can access this table", "usedBy": ""}
#     except HTTPException as e:
#         print("Error details:", e.detail)
#         raise e
#     finally:
#         # The connection will be automatically closed when it goes out of scope
#         pass

# @app.post("/pos/openTable/{company_name}/{tableNo}/{loggedUser}/{accno}")
# async def openTable(company_name: str, tableNo: str, loggedUser: str, accno: int):
#     try:
#         # Establish the database connection
#         conn = get_db(company_name)
#         cursor = conn.cursor()
#         cursor.execute(f"SELECT * FROM inv WHERE TableNo = '{tableNo}' LIMIT 1")
#         existTable = cursor.fetchone()
#         if(existTable is None):
#             cursor.execute("Insert into `order` () Values () ")
#             order_id = cursor.lastrowid
#             cursor.execute(f"Insert Into invnum (OrderId, AccountNo) Values ({order_id}, {accno}) ")
#             invoice_code = cursor.lastrowid
#             cursor.execute(
#                 f"Insert into inv(InvNo, TableNo, UsedBy) values ('{invoice_code}', '{tableNo}', '{loggedUser}')")
#             cursor.execute(
#                 f"UPDATE tablesettings SET UsedBy = '{loggedUser}' WHERE TableNo = '{tableNo}'"
#             )
#             conn.commit()
#             return {"message": invoice_code}
#         else:
#             return {"message": existTable[1]}
#     except HTTPException as e:
#         print("Error details:", e.detail)
#         raise e
#     finally:
#         # The connection will be automatically closed when it goes out of scope
#         pass

@app.post("/pos/openTable/{company_name}/{tableNo}/{loggedUser}/{accno}")
async def openTable(company_name: str, tableNo: str, loggedUser: str, accno: int):
    conn = None
    try:
        # Establish the database connection
        conn = get_db(company_name)
        cursor = conn.cursor()
        
        # Retrieve InvNo and InvType from tablesettings based on TableNo
        cursor.execute(f"SELECT InvNo, InvType FROM tablesettings WHERE TableNo = %s LIMIT 1", (tableNo,))
        tablesettings_result = cursor.fetchone()

        if tablesettings_result:
            inv_no, inv_type = tablesettings_result
            
            # Retrieve data from inv table based on InvNo and InvType
            cursor.execute(f"SELECT * FROM inv WHERE InvNo = %s AND InvType = %s LIMIT 1", (inv_no, inv_type))
            existTable = cursor.fetchone()

            if existTable is None:
                # Create a new order and insert into the database
                cursor.execute("INSERT INTO `order` () VALUES ()")
                order_id = cursor.lastrowid
                
                cursor.execute(f"INSERT INTO invnum (OrderId, AccountNo) VALUES (%s, %s)", (order_id, accno))
                invoice_code = cursor.lastrowid
                
                cursor.execute(f"INSERT INTO inv (InvNo) VALUES (%s)", (invoice_code,))
                
                cursor.execute(f"UPDATE tablesettings SET UsedBy = %s, InvNo = %s WHERE TableNo = %s", (loggedUser, invoice_code, tableNo))
                conn.commit()
                
                return {"message": invoice_code}
            else:
                return {"message": existTable[1]}  # Assuming the second column is the message you want to return
        else:
            return {"message": "No settings found for the given table."}
    
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        if conn:
            conn.close()




@app.get("/pos/resetUsedBy/{company_name}/{InvNo}")
async def resetUsedBy(company_name: str, InvNo: str):
    try:
        # Establish the database connection
        conn = get_db(company_name)
        conn2 = get_db(company_name)
        cursor = conn.cursor()
        cursor2 = conn2.cursor()

        # Update inv table
        # cursor.execute(f"UPDATE inv SET UsedBy = '' WHERE InvNo = '{InvNo}'")
        conn.commit()

        # Fetch TableNo from inv table
        cursor.execute(f"SELECT TableNo FROM inv WHERE InvNo = '{InvNo}'")
        tableNo_row = cursor.fetchone()

        if tableNo_row:  # Check if a row was fetched
            tableNo = tableNo_row[0]  # Access the TableNo value
            # cursor2.execute(f"UPDATE tablesettings SET UsedBy='' WHERE TableNo = '{tableNo}'")
            conn2.commit()

    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        pass


@app.get("/pos/getOneSection/{company_name}")
async def getOneSection(company_name: str):
    try:
        # Establish the database connection
        conn = get_db(company_name)
        cursor = conn.cursor()
        cursor.execute("Select SectionNo from section")
        secNo = cursor.fetchone()
        conn.commit()
        if secNo:
            return {"sectionNo": secNo[0]}
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        pass

# @app.post("/groupkitchen/{company_name}/{tableNo}/{loggedin}")
# async def groupkitchen(company_name: str, request: Request, tableNo: str, loggedin: str):
#     try:
#         # Establish the database connection
#         conn = get_db(company_name)
#         cursor = conn.cursor()
#         data = await request.json()
#         cursor.execute(f"Select KT, Name from printers")
#         printer_data = cursor.fetchall()
#         printer_dic = {key: name for key, name in printer_data}
#         # Specify keys for grouping
#         keys_to_group_by = ['KT1', 'KT2', 'KT3', 'KT4']
#
#         # Group meals by printer names
#         unprintedMeals = defaultdict(list)
#         for meal in data:
#             printer_names = [printer_dic.get(meal[kt_key], "") for kt_key in keys_to_group_by]
#             # Remove dashes from printer names
#             printer_names = [name.replace('-', '') for name in printer_names]
#             non_empty_printer_names = [name for name in printer_names if name]  # Filter out empty strings
#             if non_empty_printer_names:  # Check if there are non-empty printer names
#                 for kitchen in non_empty_printer_names:
#                     unprintedMeals[kitchen].append(meal)
#         return {"unprintedMeals": unprintedMeals}
#     except HTTPException as e:
#         print("Error details:", e.detail)
#         raise e
#     finally:
#         pass

@app.get("/pos/getInvHistoryDetails/{company_name}/{invNo}")
async def getAllInv(company_name: str, invNo: str):
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        totalItem = f" ((inv.Qty * inv.UPrice * (1-inv.Disc/100)) * inv.Tax/100) + (inv.Qty * inv.UPrice * (1-inv.Disc/100)) "
        cursor.execute(f"""
            SELECT inv.UPrice, inv.Qty, inv.Disc, inv.Tax, items.ItemName, {totalItem} as totalItem, invnum.InvType, invnum.InvNo, invnum.Date, invnum.RealDate, invnum.Time
            FROM inv
             JOIN items ON inv.ItemNo = items.ItemNo
             JOIN invnum ON inv.InvNo = invnum.InvNo
            WHERE inv.InvNo = '{invNo}'
        """)

        all_inv = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        inv_list = [dict(zip(column_names, inv)) for inv in all_inv]
        return inv_list
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        # The connection will be automatically closed when it goes out of scope
        pass


# @app.get("/pos/getCompTime/{company_name}")
# async def getCompTime(company_name: str):
#     try:
#         # Establish the database connection
#         conn = get_db(company_name)
#         cursor = conn.cursor()
#         cursor.execute("Select EndTime from company")
#         compTime = cursor.fetchone()
#         if compTime:
#             return {"compTime": compTime[0]}
#         else:
#             return {"compTime": "3:00"}
#     except HTTPException as e:
#         print("Error details:", e.detail)
#         raise e
#     finally:
#         pass
   
@app.post("/pos/filterInvHis/{company_name}")
async def filterInvHis(company_name: str, request: Request):
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        data = await request.json()
        startDate = data.get("startDate")
        endDate = data.get("endDate")
        startTime = data.get("startTime")
        endTime = data.get("endTime")
        currDate = data["currDate"]
        currTime = data["currTime"]     
        selectedOptionBranch = data.get("selectedOptionBranch")
        selectedOptionUser = data.get("selectedOptionUser")
        selectedOptionSA = data.get("selectedOptionSA")   
        GrossTotal = f" inv.UPrice * (1 - inv.Disc / 100) * inv.Qty "
        TotalTaxItem = f" (inv.UPrice *(1-inv.Disc/100) * inv.Tax) / 100 "
        serviceValue = f" {GrossTotal} * invnum.Srv / 100 "
        discountValue = f" (({GrossTotal} + {serviceValue}) * invnum.Disc) / 100 "
        TotalDiscount = f" ({GrossTotal} + {serviceValue}) * (1 - invnum.Disc / 100) "
        totalTaxSD = f" ({TotalTaxItem} * (1 + invnum.Srv / 100) * (1 - invnum.Disc / 100)) "
        totall = f" ({serviceValue} * invnum.Tax / 100) * (1 - invnum.Disc / 100) "
        totalTax = f" {totalTaxSD} + {totall} "
        
        conditions = []

        if startDate and endDate:
            conditions.append(f"STR_TO_DATE(invnum.Date, '%d/%m/%Y') BETWEEN STR_TO_DATE('{startDate}', '%d/%m/%Y') AND STR_TO_DATE('{endDate}', '%d/%m/%Y')")
        elif startDate:
            conditions.append(f"STR_TO_DATE(invnum.Date, '%d/%m/%Y' ) BETWEEN STR_TO_DATE('{startDate}', '%d/%m/%Y') AND STR_TO_DATE('{startDate}', '%d/%m/%Y')")
        elif endDate:
            conditions.append(f"STR_TO_DATE(invnum.Date, '%d/%m/%Y') <= STR_TO_DATE('{endDate}', '%d/%m/%Y')")
        
        if startTime and endTime:
            conditions.append(f"invnum.Time BETWEEN '{startTime}' AND '{endTime}'")
        elif startTime:
            conditions.append(f"invnum.Time BETWEEN '{startTime}' AND '{currTime}'")
        elif endTime:
            conditions.append(f"invnum.Time <= '{endTime}'")
        if selectedOptionBranch and selectedOptionBranch != "Branches":
            conditions.append(f"invnum.Branch = '{selectedOptionBranch}'")
        
        if selectedOptionUser and selectedOptionUser != "Users":
            conditions.append(f"invnum.User = '{selectedOptionUser}'")
        
        if selectedOptionSA and selectedOptionSA != "InvType":
            conditions.append(f"invnum.InvType = '{selectedOptionSA}'")
        if not conditions:
            conditions.append("1 = 1")  # Default condition to return all records if no date/time is provided
        query = f"""
        SELECT 
            invnum.User, invnum.InvNo, invnum.InvType, invnum.Date, invnum.Time, invnum.RealDate, invnum.Disc, invnum.Srv, branch.Description as Branch, invnum.Tax,
            SUM(inv.Qty) AS TotalQty,
            SUM({GrossTotal}) AS GrossTotal, 
            SUM({TotalTaxItem}) AS TotalTaxItem,
            SUM({TotalDiscount}) AS TotalDiscount,
            SUM({totalTaxSD}) AS TotalTaxSD,
            SUM({totall}) AS totall,
            SUM({totalTax}) AS totalTax,
            SUM({totalTax} + {TotalDiscount}) AS totalFinal,
            SUM({discountValue}) AS discountValue,
            SUM({serviceValue}) AS serviceValue,
            SUM(invnum.Disc) AS disc,
            SUM(invnum.Srv) AS srv,
            COUNT(DISTINCT invnum.InvNo) AS TotalInvoices
        FROM 
            invnum
        JOIN 
            inv ON inv.InvNo = invnum.InvNo
         JOIN 
             branch on branch.Code = invnum.Branch
        WHERE
            {" AND ".join(conditions)}
        GROUP BY invnum.InvNo
        """
        cursor.execute(query)
        all_inv = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        inv_list = [dict(zip(column_names, inv)) for inv in all_inv]
        print(inv_list)
        return inv_list
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        # The connection will be automatically closed when it goes out of scope
        pass

@app.post("/pos/getInvKind/{company_name}")
async def getInvKind(company_name: str, request: Request):
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        data = await request.json()
        startDate = data.get("startDate")
        endDate = data.get("endDate")
        startTime = data.get("startTime")
        endTime = data.get("endTime")
        currDate = data["currDate"]
        currTime = data["currTime"]
        print("data", data)
        conditions = []
        if startDate and endDate:
            conditions.append(f"STR_TO_DATE(Date, '%d/%m/%Y') BETWEEN STR_TO_DATE('{startDate}', '%d/%m/%Y') AND STR_TO_DATE('{endDate}', '%d/%m/%Y')")
        elif startDate:
            conditions.append(f"STR_TO_DATE(Date, '%d/%m/%Y' ) BETWEEN STR_TO_DATE('{startDate}', '%d/%m/%Y') AND STR_TO_DATE('{currDate}', '%d/%m/%Y')")
        elif endDate:
            conditions.append(f"STR_TO_DATE(Date, '%d/%m/%Y') <= STR_TO_DATE('{endDate}', '%d/%m/%Y')")
        
        if startTime and endTime:
            conditions.append(f"Time BETWEEN '{startTime}' AND '{endTime}'")
        elif startTime:
            conditions.append(f"Time BETWEEN '{startTime}' AND '{currTime}'")
        elif endTime:
            conditions.append(f"Time <= '{endTime}'")
        
        if not conditions:
            conditions.append("1 = 1")  # Default condition to return all records if no date/time is provided

        query = f"""
        SELECT 
           InvKind, COUNT(InvKind) AS TotalInvoices
        FROM 
            invnum
        WHERE
            {" AND ".join(conditions)}
        GROUP BY InvKind
        """

        cursor.execute(query)
        all_inv = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        inv_list = [dict(zip(column_names, inv)) for inv in all_inv]
        print("ana hooooooooooooo", inv_list)
        return inv_list
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        # The connection will be automatically closed when it goes out of scope
        pass
    
@app.get("/pos/getDailySalesDetails/{company_name}/{ItemNo}/{current_date}")
async def getDailySalesDetails(company_name: str, ItemNo: str, current_date):
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        formatted_date=current_date.replace('.', '/')
        GrossTotal = f" inv.UPrice * (1 - inv.Disc / 100) * inv.Qty "
        TotalTaxItem = f" (inv.UPrice *(1-inv.Disc/100) * inv.Tax) / 100 "
        serviceValue = f" {GrossTotal} * invnum.Srv / 100 "
        discountValue = f" (({GrossTotal} + {serviceValue}) * invnum.Disc) / 100 "
        TotalDiscount = f" ({GrossTotal} + {serviceValue}) * (1 - invnum.Disc / 100) "
        totalTaxSD = f" ({TotalTaxItem} * (1 + invnum.Srv / 100) * (1 - invnum.Disc / 100)) "
        totall = f" ({serviceValue} * invnum.Tax / 100) * (1 - invnum.Disc / 100) "
        totalTax = f" {totalTaxSD} + {totall} "
        cursor.execute(f"Select *, SUM({totalTax} + {TotalDiscount}) AS totalFinal FROM inv inner join invnum on inv.InvNo = invnum.InvNo WHERE  inv.ItemNo ='{ItemNo}' and invnum.Date='{formatted_date}' GROUP BY invnum.InvNo ")

        all_inv = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        inv_list = [dict(zip(column_names, inv)) for inv in all_inv]
        return inv_list
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        # The connection will be automatically closed when it goes out of scope
        pass

@app.get("/pos/station/{company_name}")
async def station(company_name: str):
    try:
        # Establish the database connection
        conn = get_db(company_name)
        cursor = conn.cursor()
        user_query = (
            f"SELECT * FROM stations "
        )
        cursor.execute(user_query)
        stat = cursor.fetchone()
        column_names = [desc[0] for desc in cursor.description]
        statDic = dict(zip(column_names, stat))
        return statDic
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        # The connection will be automatically closed when it goes out of scope
        pass


@app.post("/pos/updateStation/{company_name}")
async def updateStation(company_name: str, request: Request):
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        data = await request.json()
        sql_query = (
            f"UPDATE stations SET "
            f"ReceiptName = '{data.get('ReceiptName', '')}', "
            f"A4Name = '{data.get('A4Name', '')}', "
            f"AllowPrintInv = '{data.get('AllowPrintInv', '')}', "
            f"AllowPrintKT = '{data.get('AllowPrintKT', '')}', "
            f"QtyPrintInv = '{data.get('QtyPrintInv', '')}', "
            f"QtyPrintKT = '{data.get('QtyPrintKT', '')}' "
        )
        cursor.execute(sql_query)
        conn.commit()
        return {"message": "Station info successfully updated"}
    except Exception as e:
        print("Error details:", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")
    finally:
        # Close the cursor and connection
        cursor.close()
        conn.close()

@app.get("/pos/prlist/{company_name}")
async def prlist(company_name: str):
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        cursor.execute(f"Select * from printers_temp ")

        allp = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        p_list = [dict(zip(column_names, inv)) for inv in allp]
        return p_list
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        pass
    
@app.get("/pos/kitchen/{company_name}")
async def kitchen(company_name: str):
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        cursor.execute(f"Select * from printers ")

        ktSettings = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        kt_list = [dict(zip(column_names, inv)) for inv in ktSettings]
        return kt_list
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        pass
    
@app.post("/pos/addKitchen/{company_name}")
async def addKitchen(company_name: str, request: Request):
    language = request.headers.get("Language", "en")
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        data = await request.json()
        exist_query = (f"Select * from printers where KT = '{data['name']}' ")
        cursor.execute(exist_query)
        queryft = cursor.fetchone()
        print("queryft", queryft)
        if queryft:
             return JSONResponse(content={"message": translations[language]["kitchen_exist"]}, media_type="application/json")
            # return {"message": "kitchen already exists"}
        sql_query = (
            f"INSERT INTO printers (KT, PrinterName, ReportName) VALUES ('{data['name']}', '', '');"
        )
        cursor.execute(sql_query)
        conn.commit()
        return JSONResponse(content={"message": translations[language]["Kitche_add"]}, media_type="application/json")
        # return {"message": "kitchen inserted successfully"}
    except Exception as e:
        print("Error details:", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")
    finally:
        # Close the cursor and connection
        cursor.close()
        conn.close()

@app.post("/pos/updateKitchen/{company_name}")
async def updateKitchen(company_name: str, request: Request):
    language = request.headers.get("Language", "en")
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        data = await request.json()
        for item in data:
            exist_query = (
                f"UPDATE printers SET PrinterName = '{item['PrinterName']}', ReportName = '{item['ReportName']}' WHERE KT = '{item['KT']}'"
            )
            cursor.execute(exist_query)
        conn.commit()  # Commit the transaction after all updates
        # return {"message": "Kitchen updated successfully"}
        return JSONResponse(content={"message": translations[language]["kitchen_updated"]}, media_type="application/json")

    except Exception as e:
        print("Error details:", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")
    finally:
        # Close the cursor and connection
        cursor.close()
        conn.close()


@app.get("/pos/getAllowPrint/{company_name}")
async def getAllowPrint(company_name: str):
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        cursor.execute(f"Select QtyPrintKT, DefaultPrinter, AllowPrintInv, AllowPrintKT from stations ")
        result = cursor.fetchone()
        qtyPrintKT, defaultPrinter, allowInv, allowKT = result
        print("allowwwwwwwwwwwwww", result)
        return {"qtyPrintKT":qtyPrintKT, "defaultPrinter":defaultPrinter, "allowInv": allowInv, "allowKT":allowKT}
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        pass
    
@app.get("/pos/databaseCreation/{company_name}")
async def databaseCreation(company_name: str):
    try:
        # Connect to MySQL server
        conn = mariadb.connect(
         user= "root",
    password = "Hkms0ft",
    host= "80.81.158.76",
    port = 9988,
    database=""
        )
        cursor = conn.cursor()
        # Create the database if it doesn't exist
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {company_name}")
        conn.commit()
        cursor.execute(f"USE {company_name}")

        
        createClient ="""CREATE TABLE `clients` (
	`AccNo` INT(11) NOT NULL AUTO_INCREMENT,
	`AccName` VARCHAR(100) NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
	`Address` VARCHAR(200) NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
	`Address2` VARCHAR(200) NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
	`Tel` VARCHAR(60) NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
	`Building` VARCHAR(25) NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
	`Street` VARCHAR(25) NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
	`Floor` VARCHAR(10) NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
	`Active` VARCHAR(1) NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
	`GAddress` VARCHAR(500) NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
	`Email` VARCHAR(50) NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
	`VAT` VARCHAR(20) NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
	`Region` VARCHAR(20) NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
	`AccPrice` VARCHAR(10) NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
	`AccGroup` VARCHAR(20) NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
	`AccDisc` DOUBLE NULL DEFAULT NULL,
	`AccRemark` VARCHAR(50) NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
	INDEX `AccNo` (`AccNo`) USING BTREE
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
AUTO_INCREMENT=400011
;
"""
        cursor.execute(createClient)
        createCompany="""CREATE TABLE `company` (
	`Name` VARCHAR(100) NOT NULL COLLATE 'latin1_swedish_ci',
	`Phone` VARCHAR(100) NOT NULL COLLATE 'latin1_swedish_ci',
	`Street` VARCHAR(100) NOT NULL COLLATE 'latin1_swedish_ci',
	`Branch` VARCHAR(100) NOT NULL COLLATE 'latin1_swedish_ci',
	`City` VARCHAR(100) NOT NULL COLLATE 'latin1_swedish_ci',
	`Currency` VARCHAR(100) NOT NULL COLLATE 'latin1_swedish_ci',
	`Name2` VARCHAR(100) NOT NULL COLLATE 'latin1_swedish_ci',
	`EndTime` VARCHAR(300) NOT NULL COLLATE 'latin1_swedish_ci',
	`Rate` DOUBLE NOT NULL,
	`VAT` VARCHAR(21) NOT NULL COLLATE 'latin1_swedish_ci',
	`KD` VARCHAR(2) NOT NULL COLLATE 'latin1_swedish_ci',
	UNIQUE INDEX `ix_company_name` (`Name`) USING BTREE
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;

"""
        cursor.execute(createCompany)
        createCurrency ="""CREATE TABLE `currencies` (
	`id` VARCHAR(10) NOT NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
	`name` VARCHAR(50) NULL COLLATE 'latin1_swedish_ci',
	`Code` VARCHAR(5) NULL COLLATE 'latin1_swedish_ci'
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;

"""
        cursor.execute(createCurrency)
        createDepartments="""CREATE TABLE `departments` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(100) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`description` VARCHAR(100) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `name` (`name`) USING BTREE,
	INDEX `ix_departments_id` (`id`) USING BTREE
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;
"""
        cursor.execute(createDepartments)
        createGroupItem="""CREATE TABLE `groupitem` (
	`GroupNo` VARCHAR(10) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`GroupName` VARCHAR(100) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`Image` VARCHAR(100) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	UNIQUE INDEX `code` (`GroupNo`) USING BTREE
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;
"""
        cursor.execute(createGroupItem)
        createInv="""CREATE TABLE `inv` (
	`InvType` VARCHAR(10) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`InvNo` VARCHAR(10) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`ItemNo` VARCHAR(20) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`Barcode` VARCHAR(20) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`Branch` VARCHAR(10) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`Qty` DOUBLE NULL DEFAULT NULL,
	`UPrice` DOUBLE NULL DEFAULT NULL,
	`Disc` DOUBLE NULL DEFAULT NULL,
	`Tax` DOUBLE NULL DEFAULT NULL,
	`GroupNo` VARCHAR(10) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`KT1` VARCHAR(2) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`KT2` VARCHAR(2) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`KT3` VARCHAR(2) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`KT4` VARCHAR(2) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`TableNo` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`UsedBy` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`Printed` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`Index` INT(11) NULL DEFAULT NULL
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;
"""
        cursor.execute(createInv)
        createInvNum="""CREATE TABLE `invnum` (
	`InvType` VARCHAR(10) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`InvNo` INT(11) NOT NULL AUTO_INCREMENT,
	`Date` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`Time` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`AccountNo` INT(11) NULL DEFAULT NULL,
	`CardNo` VARCHAR(20) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`Branch` VARCHAR(10) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`Disc` DOUBLE NULL DEFAULT NULL,
	`Srv` DOUBLE NULL DEFAULT NULL,
	`RealDate` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`RealTime` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`OrderId` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`CashOnHand` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`EOD` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`User` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`InvKind` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
    `Tax` DOUBLE NULL DEFAULT NULL,
	UNIQUE INDEX `InvNo` (`InvNo`) USING BTREE
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
AUTO_INCREMENT=76
;
"""
        cursor.execute(createInvNum)
        createItems = """CREATE TABLE `items` (
	`ItemNo` VARCHAR(20) NOT NULL DEFAULT '0' COLLATE 'latin1_swedish_ci',
	`GroupNo` VARCHAR(10) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`ItemName` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
	`Image` VARCHAR(100) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`UPrice` DOUBLE NULL DEFAULT NULL,
	`Disc` DOUBLE NULL DEFAULT NULL,
	`Tax` DOUBLE NULL DEFAULT NULL,
	`KT1` VARCHAR(2) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`KT2` VARCHAR(2) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`KT3` VARCHAR(2) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`KT4` VARCHAR(2) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`Active` VARCHAR(2) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`Ingredients` VARCHAR(150) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci'
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;
"""
        cursor.execute(createItems)
        createPrinters ="""CREATE TABLE `printers` (
	`KT` VARCHAR(4) NOT NULL COLLATE 'latin1_swedish_ci',
	`PrinterName` VARCHAR(50) NOT NULL COLLATE 'latin1_swedish_ci',
	`ReportName` VARCHAR(50) NOT NULL COLLATE 'latin1_swedish_ci'
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;
"""
        cursor.execute(createPrinters)
        createPrintersTemp="""CREATE TABLE `printers_temp` (
	`printername` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	UNIQUE INDEX `printername` (`printername`) USING BTREE
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;
"""
        cursor.execute(createPrintersTemp)
        createSection ="""CREATE TABLE `section` (
	`SectionNo` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`Name` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci'
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;"""
        cursor.execute(createSection)
        createStations="""CREATE TABLE `stations` (
	`pcname` VARCHAR(20) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`DefaultPrinter` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`ReceiptName` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`A4Name` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`AllowPrintInv` VARCHAR(2) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`AllowPrintKT` VARCHAR(2) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`QtyPrintInv` VARCHAR(2) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`QtyPrintKT` VARCHAR(2) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	UNIQUE INDEX `pcname` (`pcname`) USING BTREE
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;
"""
        cursor.execute(createStations)
        createTableSettings = """CREATE TABLE `tablesettings` (
	`TableNo` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`TableWaiter` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`SectionNo` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`Active` VARCHAR(1) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`Description` VARCHAR(100) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`UsedBy` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	UNIQUE INDEX `TableNo` (`TableNo`, `SectionNo`) USING BTREE
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;
"""
        cursor.execute(createTableSettings)
        createUsers ="""CREATE TABLE `users` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`username` VARCHAR(100) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`password` VARCHAR(200) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`user_control` VARCHAR(100) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`email` VARCHAR(100) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`sales` VARCHAR(100) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`sales_return` VARCHAR(100) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`purshase` VARCHAR(100) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`purshase_return` VARCHAR(100) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`orders` VARCHAR(100) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`trans` VARCHAR(100) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`items` VARCHAR(100) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`chart` VARCHAR(100) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`statement` VARCHAR(100) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`SAType` VARCHAR(100) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`Branch` VARCHAR(100) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`COH` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`EOD` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
    `RecallInv` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `ix_users_id` (`id`) USING BTREE
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
AUTO_INCREMENT=1
;

"""
        cursor.execute(createUsers)

        createBranch = """CREATE TABLE `branch` (
	`Code` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`Description` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci'
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;
"""
        cursor.execute(createBranch)

        createOrder = """CREATE TABLE `order` (
	`OrderId` INT(11) NOT NULL AUTO_INCREMENT,
	UNIQUE INDEX `OrderId` (`OrderId`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=121
;
"""
        cursor.execute(createOrder)

        insertCompany = """
            INSERT INTO company (Name, Phone, Street, Branch, City, Currency, Name2, EndTime, Rate, VAT, KD)
             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
                      """
        values = (company_name, '', '', '', '', '1', '', '00:00:00', 89000, 11, '*')
        cursor.execute(insertCompany, values)
        insertUser = """
    INSERT INTO users(
        username, password, user_control, email, sales, sales_return, purshase, 
        purshase_return, orders, trans, items, chart, statement, SAType, Branch, COH, EOD, RecallInv
    ) 
    VALUES ('hkm', '123', 'Y', '', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'SA', '1', 'All', 'Y', 'N');
"""
        cursor.execute(insertUser)

        insertBranch = """
    INSERT INTO branch(
        Code, Description
    ) 
    VALUES ('1', 'Cornish El Mazraa');
"""
        cursor.execute(insertBranch)

        insertCurrency = """
    INSERT INTO currencies(
       id, name, Code
    ) 
    VALUES ('1', 'United States Dollars', 'USD'), ('2', 'LBP', 'LBP');;
"""
        cursor.execute(insertCurrency)
        conn.commit()

    except Exception as e:
        raise e


@app.get("/pos/currency/{company_name}")
async def currency(company_name: str):
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        cursor.execute(f"Select * from currencies ")

        crSettings = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        cr_list = [dict(zip(column_names, inv)) for inv in crSettings]
        print("invvvvvvvvvvvvvvvvvvv", cr_list)
        return cr_list
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        pass
    
@app.post("/pos/addCurrency/{company_name}")
async def addCurrency(company_name: str, request: Request):
    language = request.headers.get("Language", "en")
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        data = await request.json()
        exist_query = (f"Select * from currencies where id = '{data['name']}' ")
        cursor.execute(exist_query)
        queryft = cursor.fetchone()
        if queryft:
            return JSONResponse(content={"message": translations[language]["currency_exist"]}, media_type="application/json")
            # return {"message": "Currency already exists"}
        sql_query = (
            f"INSERT INTO currencies (id, name, Code) VALUES ('{data['name']}', '', '');"
        )
        cursor.execute(sql_query)
        conn.commit()
        return JSONResponse(content={"message": translations[language]["currency_add"]}, media_type="application/json")
        # return {"message": "Currency inserted successfully"}
    except Exception as e:
        print("Error details:", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")
    finally:
        # Close the cursor and connection
        cursor.close()
        conn.close()

@app.post("/pos/updateCurrency/{company_name}")
async def updateCurrency(company_name: str, request: Request):
    language = request.headers.get("Language", "en")
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        data = await request.json()
        for item in data:
            exist_query = (
                f"UPDATE currencies SET name = '{item['name']}', Code = '{item['Code']}' WHERE id = '{item['id']}'"
            )
            cursor.execute(exist_query)
        conn.commit()  # Commit the transaction after all updates
        return JSONResponse(content={"message": translations[language]["currency_updated"]}, media_type="application/json")
        # return {"message": "Currency updated successfully"}
    except Exception as e:
        print("Error details:", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")
    finally:
        # Close the cursor and connection
        cursor.close()
        conn.close()

@app.get("/pos/getLastOrderIdDate/{company_name}")
async def getLastOrderIdDate(company_name: str):
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT Date 
            FROM invnum 
            WHERE OrderId = 1 
            ORDER BY STR_TO_DATE(Date, '%d/%m/%Y') DESC 
            LIMIT 1
        """)
        lastDateOrder = cursor.fetchone()
        return lastDateOrder[0]
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        pass
    
# @app.post("/pos/resetOrderId/{company_name}")
# async def resetOrderId(company_name: str, request: Request):
#     try:
#         print("anaaaa", company_name)
#         conn = get_db(company_name)
#         cursor = conn.cursor()
#         data = await request.json()
#         cursor.execute(f" Update invnum set EOD='{data['dateTime']}'  where Date = '{data['date']}' ")
#         cursor.execute(f"Delete from `order` ") 
#         conn.commit()
#         cursor.execute("ALTER TABLE `order` AUTO_INCREMENT = 1")
#         conn.commit()
#         return {"message": "The day is closed and order is reset"}
#     except Exception as e:
#         print("Error details:", str(e))
#         raise HTTPException(status_code=500, detail="Internal server error")
#     finally:
#         pass

@app.post("/pos/resetOrderId/{company_name}")
async def resetOrderId(company_name: str, request: Request):
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        data = await request.json()

        # Escape the user identifier
        user = data['user']

      
        # Check if there are open tables for the selected user or all users
        if user == "All Users":
            cursor.execute("SELECT COUNT(*) FROM invnum WHERE InvKind = 'Table' AND (TableNo IS NULL OR TableNo = '') AND (EOD IS NULL OR EOD = '')")
        else:
            cursor.execute(f"SELECT COUNT(*) FROM invnum WHERE InvKind = 'Table' AND `User` = '{user}' AND (TableNo IS NULL OR TableNo = '') AND (EOD IS NULL OR EOD = '')")

        open_tables = cursor.fetchone()[0]

        if open_tables > 0:
            if user == "All Users":
                return {"message": "Cannot close End of Day. There are open tables that must be closed for some users."}
            else:
                return {"message": f"Cannot close End of Day. There are open tables for user {user} that must be closed."}

           # Check CashOnHand status for the selected user or all users
        if user == "All Users":
            cursor.execute("SELECT COUNT(*) FROM invnum WHERE (CashOnHand IS NULL OR CashOnHand = '')  AND (EOD IS NULL OR EOD = '')")
        else:
            cursor.execute(f"SELECT COUNT(*) FROM invnum WHERE `User`='{user}' AND (CashOnHand IS NULL OR CashOnHand = '') AND (EOD IS NULL OR EOD = '')")

        cash_on_hand_count = cursor.fetchone()[0]

        if cash_on_hand_count > 0:
            if user == "All Users":
                return {"message": "Cannot close End of Day. Cash on hand is not set for some users."}
            else:
                return {"message": f"Cannot close End of Day. Cash on hand is not set for user {user}."}
        

        if user == "All Users":
            # Close EOD for all users
            cursor.execute(f"UPDATE invnum SET EOD='{data['dateTime']}' where (EOD IS NULL OR EOD = '')")
            cursor.execute("DELETE FROM `order`")
            conn.commit()
            cursor.execute("ALTER TABLE `order` AUTO_INCREMENT = 1")
            conn.commit()
            return {"message": "End of day closed and orders reset for all users."}  # Message for all users
        else:
            # Close EOD for the selected user only
            cursor.execute(f"UPDATE invnum SET EOD='{data['dateTime']}' WHERE `User`='{user}'AND (EOD IS NULL OR EOD = '')")  # Escape `User`
            cursor.execute("DELETE FROM `order`") 
            conn.commit()
            cursor.execute("ALTER TABLE `order` AUTO_INCREMENT = 1")
            conn.commit()
            return {"message": f"End of day closed and orders reset for user: {user}."}  # Message for specific user

    except Exception as e:
        print("Error details:", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/pos/reportUserShift/{company_name}/{date}/{allowedUser}")
async def getReportUserShift(company_name: str, date:str, allowedUser: str):
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        formatted_date = date.replace('.', '/')
        # cursor.execute(f"SELECT InvType, InvNo, Date, Time, Branch, Disc, Srv, User FROM invnum WHERE Date='{formatted_date}' ")
       
        GrossTotal = f" inv.UPrice * (1 - inv.Disc / 100) * inv.Qty "
        TotalTaxItem = f" (inv.UPrice *(1-inv.Disc/100) * inv.Tax) / 100 "
        serviceValue= f" {GrossTotal} * invnum.Srv/100 "
        discountValue = f" (({GrossTotal} + {serviceValue}) * invnum.Disc)/100 "
        TotalDiscount = f" ({GrossTotal} + {serviceValue}) * (1-invnum.Disc/100) "
        totalTaxSD = f" ({TotalTaxItem} * (1+invnum.Srv/100) * (1-invnum.Disc/100)) "
        totall = f" ({serviceValue}* invnum.Tax/100 ) * (1-invnum.Disc/100) "
        totalTax= f" {totalTaxSD} + {totall} "
        base_query = f"""
        SELECT 
            invnum.User, 
            invnum.Srv, 
            invnum.Disc, 
            invnum.Branch, 
            invnum.InvType, 
            invnum.InvNo,
            invnum.Time,
            invnum.AccountNo,
            invnum.Date,
            SUM(inv.Qty) AS TotalQty,
            SUM({GrossTotal}) AS GrossTotal, 
            SUM({TotalTaxItem}) AS TotalTaxItem,
            SUM({TotalDiscount}) AS TotalDiscount,
            SUM({totalTaxSD}  ) AS TotalTaxSD,
            SUM({totall}) AS totall,
            SUM({totalTax}) AS totalTax,
            SUM({totalTax} + {TotalDiscount}) AS totalFinal,
            COUNT(DISTINCT invnum.InvNo) AS TotalInvoices
        FROM 
            invnum
        JOIN 
            inv ON inv.InvNo = invnum.InvNo
        WHERE 
             (invnum.CashOnHand = '' or invnum.CashOnHand is null)AND (invnum.User IS NOT NULL AND invnum.User != '')
        """
        if allowedUser != "All":
            query = base_query + f" AND invnum.User = '{allowedUser}' GROUP BY invnum.InvNo"
        else:
            query = base_query + " GROUP BY invnum.InvNo"
        cursor.execute(query)
        cashOnHnads = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        cash_list = [dict(zip(column_names, reportUser)) for reportUser in cashOnHnads]
        return cash_list
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        pass
    
@app.get("/pos/COHDetails/{company_name}/{date}/{invNo}")
async def COHDetails(company_name: str, date:str, invNo:str):
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        totalItem = f" ((inv.Qty * inv.UPrice * (1-inv.Disc/100)) * inv.Tax/100) + (inv.Qty * inv.UPrice * (1-inv.Disc/100)) "
        queryh=f"Select invnum.User, invnum.InvType, inv.InvNo, items.ItemName, inv.ItemNo, inv.Qty, inv.UPrice, inv.Disc, inv.Tax, {totalItem} as totalItem from invnum JOIN inv ON inv.InvNo = invnum.InvNo JOIN items ON items.ItemNo = inv.ItemNo where inv.invNo={invNo} "
        cursor.execute(queryh)
        codDetails = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        cash_list = [dict(zip(column_names, reportUser)) for reportUser in codDetails]
        return cash_list
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        pass

@app.get("/pos/calculateUserShifts/{company_name}/{date}/{allowedUser}")
async def calculateUserShifts(company_name: str, date: str, allowedUser: str):
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        formatted_date = date.replace('.', '/')
        GrossTotal = f" inv.UPrice * (1 - inv.Disc / 100) * inv.Qty "
        TotalTaxItem = f" (inv.UPrice *(1-inv.Disc/100) * inv.Tax) / 100 "
        serviceValue= f" {GrossTotal} * invnum.Srv/100 "
        discountValue = f" (({GrossTotal} + {serviceValue}) * invnum.Disc)/100 "
        TotalDiscount = f" ({GrossTotal} + {serviceValue}) * (1-invnum.Disc/100) "
        totalTaxSD = f" ({TotalTaxItem} * (1+invnum.Srv/100) * (1-invnum.Disc/100)) "
        totall = f" ({serviceValue}* invnum.Tax/100 ) * (1-invnum.Disc/100) "
        totalTax= f" {totalTaxSD} + {totall} "
        base_query = f"""
        SELECT 
            invnum.User, 
            SUM(inv.Qty) AS TotalQty,
            SUM({GrossTotal}) AS GrossTotal, 
            SUM({TotalTaxItem}) AS TotalTaxItem,
            SUM({TotalDiscount}) AS TotalDiscount,
            SUM({totalTaxSD}  ) AS TotalTaxSD,
            SUM({totall}) AS totall,
            SUM({totalTax}) AS totalTax,
            SUM({totalTax} + {TotalDiscount}) AS totalFinal,
            SUM({discountValue}) AS discountValue,
            SUM({serviceValue}) AS serviceValue,
            SUM(invnum.Disc) AS ee,
            SUM(invnum.Srv) AS dd,
            COUNT(DISTINCT invnum.InvNo) AS TotalInvoices
        FROM 
            invnum
        JOIN 
            inv ON inv.InvNo = invnum.InvNo
        WHERE 
            invnum.Date = '{formatted_date}' AND (invnum.CashOnHand IS NULL OR invnum.CashOnHand = '')
        """
        if allowedUser != "All":
            query = base_query + f" AND invnum.User = '{allowedUser}'"
        else:
            query = base_query + " GROUP BY invnum.User"
        cursor.execute(query)
        report_data = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        report_list = [dict(zip(column_names, row)) for row in report_data]
        print("antoooooooooo", report_list)
        return report_list
    except Exception as e:
        print("Error details:", str(e))
        raise HTTPException(status_code=500, detail="An error occurred while calculating user shifts")
    finally:
        cursor.close()
        conn.close()
    
@app.post("/pos/userShiftClose/{company_name}")
async def userShiftClose(company_name: str, request: Request):
    conn = None
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        data = await request.json()
        if data["username"] == "all":
            cursor.execute("SELECT DISTINCT User FROM invnum")
            allusers = cursor.fetchall()
            for user in allusers:
                cursor.execute(
                    "UPDATE invnum SET CashOnHand = %s WHERE  User = %s AND (CashOnHand IS NULL OR CashOnHand = '')",
                    (data["dateTime"],  user[0])
                )
        else:
            cursor.execute(
                "UPDATE invnum SET CashOnHand = %s WHERE  User = %s AND (CashOnHand IS NULL OR CashOnHand = '')",
                (data["dateTime"],data["username"])
            )
        conn.commit()
        return {"message": "Your shift is closed"}
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    except Exception as e:
        print("Unexpected error:", str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        if conn:
            conn.close()
   
# @app.get("/pos/eod/{company_name}/{date}")
# async def getEOD(company_name: str, date: str):
#     try:
#         conn = get_db(company_name)
#         cursor = conn.cursor()
#         formatted_date = date.replace('.', '/')
#         cursor.execute(f"SELECT InvType, InvNo, Date, Time, Branch, Disc, Srv, CashOnHand, User FROM invnum WHERE Date='{formatted_date}' and (EOD IS NULL or EOD = '') ")
#         eod = cursor.fetchall()
#         column_names = [desc[0] for desc in cursor.description]
#         eod_list = [dict(zip(column_names, reportUser)) for reportUser in eod]
#         return eod_list
#     except HTTPException as e:
#         print("Error details:", e.detail)
#         raise e
#     finally:
#         pass

@app.get("/pos/eod/{company_name}/{date}")
async def getEOD(company_name: str, date: str):
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        formatted_date = date.replace('.', '/')
        
        # Fetch EOD data
        cursor.execute(f"""
            SELECT InvType, InvNo, Date, Time, Branch, Disc, Srv, CashOnHand, User 
            FROM invnum 
            WHERE (EOD IS NULL OR EOD = '')
                AND User IS NOT NULL AND User != ''
        """)
        eod = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        eod_list = [dict(zip(column_names, reportUser)) for reportUser in eod]
        
        # Fetch distinct users
        cursor.execute(f"""
            SELECT DISTINCT User 
            FROM invnum 
            WHERE (EOD IS NULL OR EOD = '')
                AND User IS NOT NULL AND User != ''    
        """)
        users = cursor.fetchall()
        user_list = [user[0] for user in users]
        
        return {"eod_data": eod_list, "users": user_list}
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        cursor.close()  # Ensure cursor is closed
        conn.close()  # Ensure connection is closed


@app.get("/pos/getEndOfDayAccessUsers/{company_name}/{username}")
async def getEndofDayRead(company_name: str, username:str):
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        cursor.execute(f"SELECT EndOfDayAccessUsers FROM users WHERE username='{username}' ")
        COHR = cursor.fetchone()
        return COHR[0]
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        pass


@app.get("/pos/EndshiftEod/{company_name}/{username}")
async def getEndshiftEod(company_name: str, username:str):
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        cursor.execute(f"SELECT EndshiftEod FROM users WHERE username='{username}' ")
        EODR = cursor.fetchone()
        if EODR is None or EODR[0] != 'Y':
            raise HTTPException(status_code=403, detail="No access permission.")

        return EODR[0]
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        pass

@app.get("/pos/EndShiftCOH/{company_name}/{username}")
async def getEndShiftCOH(company_name: str, username:str):
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        cursor.execute(f"SELECT EndShiftCOH FROM users WHERE username='{username}' ")
        EshR = cursor.fetchone()
        if EshR is None or EshR[0] != 'Y':
            raise HTTPException(status_code=403, detail="No access permission.")

        return EshR[0]
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        pass
    
    
 

@app.get("/pos/getCOHUsers/{company_name}/{date}")
async def getEOD(company_name: str, date: str):
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        formatted_date = date.replace('.', '/')
        cursor.execute(f"SELECT InvType, InvNo, Date, Time, Branch, Disc, Srv, CashOnHand, User FROM invnum WHERE Date='{formatted_date}' ")
        eod = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        eod_list = [dict(zip(column_names, reportUser)) for reportUser in eod]
        return eod_list
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        pass

@app.get("/pos/getCOHRead/{company_name}/{username}")
async def getCOHRead(company_name: str, username:str):
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        cursor.execute(f"SELECT COH FROM users WHERE username='{username}' ")
        COHR = cursor.fetchone()
        return COHR[0]
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        pass
    
@app.get("/pos/getEODPermission/{company_name}/{username}")
async def getCOHRead(company_name: str, username:str):
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        cursor.execute(f"SELECT EOD FROM users WHERE username='{username}' ")
        EODR = cursor.fetchone()
        return EODR[0]
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        pass



@app.post("/pos/updateBranch/{company_name}")
async def updateBranch(
        company_name: str,
        request: Request,
):
    conn = None
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        data = await request.json()
        for item in data:
            exist_query = (
                f"UPDATE branch SET Code = '{item['Code']}', Description = '{item['Description']}' WHERE Code = '{item['Code']}'"
            )
            cursor.execute(exist_query)
        conn.commit()  # Commit the transaction after all updates
        return {"message": "Branch updated successfully"}
    except Exception as e:
        print("Error details:", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")
    finally:
        # Close the cursor and connection
        cursor.close()
        conn.close()


@app.post("/pos/addBranch/{company_name}/{branch_no}")
async def addBranch(
        company_name: str,
        branch_no: str,
        request: Request,
):
    conn = None
    language = request.headers.get("Language", "en")
    try:
        # Check if the user exists in the given company
        conn = get_db(company_name)
        cursor = conn.cursor()

        # Check if the user exists
        addBranch_query = f"SELECT * FROM branch WHERE Code = %s"

        cursor.execute(addBranch_query, (branch_no,))

        existItem = cursor.fetchone()
        if existItem is not None:
            return JSONResponse(content={"message": translations[language]["branch_exist"]}, media_type="application/json")
            # return {"message": "Branch already exists"}
        data = await request.json()
        insert_query = f"INSERT INTO branch(Code, Description) VALUES (%s, %s)"
        cursor.execute(insert_query, (branch_no, ''))
        conn.commit()
        return JSONResponse(content={"message": translations[language]["branch_add"]}, media_type="application/json")
        # return {"message": "Branch added successfully", "branch": branch_no}
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        if conn:
            conn.close()

@app.get("/pos/branch/{company_name}")
async def branch(
        company_name: str,
):
    conn = None
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        cursor.execute(f"SELECT * FROM branch ")
        fetchBranch = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        branch_list = [dict(zip(column_names, br)) for br in fetchBranch]
        print("branch", branch_list)
        return branch_list
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        if conn:
            conn.close()

@app.get("/pos/Unitprice/{company_name}")
async def unitprice(company_name: str):
    conn = None
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM unitprice")
        fetchUnitPrice = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        UnitPrice_list = [dict(zip(column_names, up)) for up in fetchUnitPrice]
        print("UnitPrice", UnitPrice_list)
        return UnitPrice_list
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        if conn:
            conn.close()

@app.get("/pos/distInvType/{company_name}")
async def distInvType(
        company_name: str,
):
    conn = None
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        cursor.execute(f"SELECT distinct SAType from users ")
        fetchSA = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        sa_list = [dict(zip(column_names, sa)) for sa in fetchSA]
        print("sa_list", sa_list)
        return sa_list
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        if conn:
            conn.close()

@app.get("/pos/getVAT/{company_name}")
async def getVAT(
        company_name: str,
):
    conn = None
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        cursor.execute(f"SELECT VAT from company ")
        vat = cursor.fetchone()
        column_names = [desc[0] for desc in cursor.description]
        va_list = dict(zip(column_names, vat))
        print("sa_list", va_list)
        return va_list
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        if conn:
            conn.close()

@app.post("/pos/updatePrint/{company_name}")
async def updatePrint(
        company_name: str,
        request: Request,
):
    conn = None
    try:
        # Check if the user exists in the given company
        conn = get_db(company_name)
        cursor = conn.cursor()
        data = await request.json()
        print("ANA JDIDDDDDD", data)
        cursor.execute(f"Update stations set AllowPrintInv='{data['allowPrintInv']}', AllowPrintKT='{data['allowPrintKT']}' ")
        conn.commit() 
        return {"message": "print updated successfully", }
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        if conn:
            conn.close()

@app.get("/pos/getRecallInv/{company_name}/{invNo}/{loggedType}")
async def getRecallInv(company_name: str, invNo: str, loggedType: str):
    conn = None
    try:
        conn = get_db(company_name)
        cursor = conn.cursor(buffered=True)  # Ensure a buffered cursor is used
        
        # Determine invoice type and number
        if "SA" in invNo or "sa" in invNo:
            inv_type, inv_no = invNo.split("-", 1)
            inv_type = inv_type.strip().upper()
            inv_no = inv_no.strip()
        else:
            inv_no = invNo
            inv_type = loggedType

        # Query to fetch invoice details including Eod check
        cursor.execute(
            "SELECT Eod FROM invnum WHERE InvNo = %s AND InvType = %s",
            (inv_no, inv_type)
        )
        invnum_result = cursor.fetchone()
        if invnum_result:
            eod = invnum_result[0]
            # Check if Eod is NULL or empty
            if eod not in (None, ''):
                return {"message": "This invoice is already End of day"}

        # Check if the invoice exists in the inv table
        existing_table_query = """
            SELECT *
            FROM inv
            WHERE InvNo = %s AND InvType = %s LIMIT 1
        """
        cursor.execute(existing_table_query, (inv_no, inv_type))
        existing_inv = cursor.fetchone()

        # If invoice exists, proceed to retrieve items
        if existing_inv:
            cursor.execute("SELECT Disc, Srv,InvKind  FROM invnum WHERE InvNo = %s", (inv_no,))
            result = cursor.fetchone()
            disc, srv,inv_kind  = result if result else (None, None)

            cursor.execute("SELECT `Index` FROM inv WHERE InvNo = %s GROUP BY `Index`", (inv_no,))
            extract_indexes = cursor.fetchall()  # Fetch all indexes
            
            inv_list = []

            if extract_indexes and extract_indexes[0][0] is not None:
                for e_index_row in extract_indexes:
                    e_index = e_index_row[0]

                    # Query for principal items
                    query = """
                        SELECT inv.*, items.ItemName 
                        FROM inv 
                        LEFT JOIN items ON inv.ItemNo = items.ItemNo 
                        WHERE inv.Index = %s AND inv.InvNo = %s AND inv.GroupNo != 'MOD'
                    """
                    cursor.execute(query, (e_index, inv_no))
                    princ_items = cursor.fetchone()
                    
                    if princ_items:
                        column_names = [desc[0] for desc in cursor.description]
                        princ_item = dict(zip(column_names, princ_items))

                        # Query for modifier items
                        query2 = """
                            SELECT inv.*, items.ItemName 
                            FROM inv 
                            LEFT JOIN items ON inv.ItemNo = items.ItemNo 
                            WHERE inv.InvNo = %s AND inv.Index = %s AND inv.GroupNo = 'MOD'
                        """
                        cursor.execute(query2, (inv_no, e_index))
                        item_mods = cursor.fetchall()  # Fetch all modifier items
                        
                        column_names = [desc[0] for desc in cursor.description]
                        item_mod = [dict(zip(column_names, imod)) for imod in item_mods]

                        item = {
                            "ItemNo": princ_item.get("ItemNo"),
                            "ItemName": princ_item.get("ItemName"),
                            "Printed": princ_item.get("Printed"),
                            "UPrice": princ_item.get("UPrice"),
                            "Disc": princ_item.get("Disc"),
                            "Tax": princ_item.get("Tax"),
                            "quantity": princ_item.get("Qty"),
                            "KT1": princ_item.get("KT1"),
                            "KT2": princ_item.get("KT2"),
                            "KT3": princ_item.get("KT3"),
                            "KT4": princ_item.get("KT4"),
                            "index": princ_item.get("Index"),
                            "GroupNo": princ_item.get("GroupNo"),
                            "chosenModifiers": [
                                {"ItemNo": itemod["ItemNo"], "ItemName": itemod["ItemName"]}
                                for itemod in item_mod
                            ]
                        }
                        inv_list.append(item)

                return {
                    "inv_list": inv_list,
                    "invNo": inv_no,
                    "disc": disc,
                    "srv": srv,
                    "invType": inv_type,
                    "invKind": inv_kind
                }

        return {"message": "No invoice with this number"}
      
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    
    finally:
        if conn:
            conn.close()


# @app.get("/pos/getRecallInv/{company_name}/{invNo}/{loggedType}")
# async def getRecallInv(company_name: str, invNo: str, loggedType: str):
#     conn = None
#     try:
#         conn = get_db(company_name)
#         cursor = conn.cursor()
#         if "SA" in invNo or "sa" in invNo:
#             inv_type, inv_no = invNo.split("-", 1)
#             inv_type = inv_type.strip().upper()
#             inv_no = inv_no.strip()
#         else:
#             inv_no = invNo
#             inv_type = loggedType
#         # Check if the updated ItemNo already exists and is not the same as the original one
#         existing_table_query = """
#                     SELECT *
#                     FROM inv
#                     WHERE InvNo = %s and InvType = %s LIMIT 1
#                 """
#         cursor.execute(existing_table_query, (inv_no,inv_type))
#         existing_inv = cursor.fetchone()
#         # Get column names from cursor.description if result set exists
#         if existing_inv:
#             cursor.execute(f"Select Disc, Srv from invnum where InvNo ='{inv_no}'")
#             result = cursor.fetchone()
#             disc, srv = result
#             cursor.execute(f" Select `Index` from inv where InvNo= '{inv_no}' Group By `Index` ")
#             extract_indexes = cursor.fetchall()
#             inv_list = []
#             if extract_indexes and extract_indexes[0][0] is not None:

#                 for e_index_row in extract_indexes:
#                     e_index = e_index_row[0]
#                     query = f" Select inv.*, items.ItemName from inv left join items on inv.ItemNo = items.ItemNo where inv.Index = {e_index} and inv.InvNo = '{inv_no}' and inv.GroupNo != 'MOD' "
#                     cursor.execute(query)
#                     princ_items = cursor.fetchone()
#                     column_names = [desc[0] for desc in cursor.description]
#                     princ_item = dict(zip(column_names, princ_items))
#                     query2 = f" Select inv.*, items.ItemName from inv left join items on inv.ItemNo = items.ItemNo Where inv.InvNo = '{inv_no}' and inv.Index = {e_index} and inv.GroupNo = 'MOD' "
#                     cursor.execute(query2)
#                     item_mods = cursor.fetchall()
#                     column_names = [desc[0] for desc in cursor.description]
#                     item_mod = [dict(zip(column_names, imod)) for imod in item_mods]
#                     item = {
#                         "ItemNo": princ_item["ItemNo"],
#                         "ItemName": princ_item["ItemName"],
#                         "Printed": princ_item["Printed"],
#                         "UPrice": princ_item["UPrice"],
#                         "Disc": princ_item["Disc"],
#                         "Tax": princ_item["Tax"],
#                         "quantity": princ_item["Qty"],
#                         "KT1": princ_item["KT1"],
#                         "KT2": princ_item["KT2"],
#                         "KT3": princ_item["KT3"],
#                         "KT4": princ_item["KT4"],
#                         "index": princ_item["Index"],
#                         "GroupNo": princ_item["GroupNo"],
#                         "chosenModifiers": [
#                             {"ItemNo": itemod["ItemNo"], "ItemName": itemod["ItemName"]}
#                             for itemod in item_mod
#                         ]
#                     }
#                     inv_list.append(item)
#                 return {"inv_list": inv_list, "invNo": inv_no, "disc": disc, "srv": srv, "invType": inv_type }
#         return {"message": "No invoice with this number"}
#     except HTTPException as e:
#         print("Error details:", e.detail)
#         raise e
#     finally:
#         if conn:
#             conn.close()

# @app.post("/pos/getBackInv/{company_name}/{loggedType}")
# async def getBackInv(company_name: str, loggedType: str, request: Request,):
#     conn = None
#     try:
#         conn = get_db(company_name)
#         cursor = conn.cursor()
#         inv_type = loggedType
#         data = await request.json()
        
#         if data["message"]:  
#             message = int(data["message"])
#             cursor.execute("SELECT InvNo, Date, Time FROM invnum WHERE InvType = %s AND InvNo < %s ORDER BY InvNo DESC LIMIT 1", 
#                (loggedType, message))
#             result = cursor.fetchone()
#             inv_no = result[0] if result else None
#             recallDate = result[1]
#             recallTime = result[2]
#         else:
#             cursor.execute(
#             "SELECT InvNo, Date, Time FROM invnum WHERE InvType = %s ORDER BY InvNo DESC LIMIT 1",
#             (loggedType,)
#             )
#             result = cursor.fetchone()
#             inv_no = result[0] if result else None
#             recallDate = result[1]
#             recallTime = result[2]
#         print("invvvvv no", inv_no)
#         print("invvv typeeeeeeee", inv_type)
#         # Check if the updated ItemNo already exists and is not the same as the original one
#         existing_table_query = """
#                     SELECT *
#                     FROM inv
#                     WHERE InvNo = %s and InvType = %s LIMIT 1
#                 """
        
#         cursor.execute(existing_table_query, (inv_no,inv_type))
#         existing_inv = cursor.fetchone()
#         print("existingggg", existing_inv)
#         # Get column names from cursor.description if result set exists
#         if existing_inv:
#             print("anaafafafaagag")
#             cursor.execute(f"Select Disc, Srv from invnum where InvNo ='{inv_no}'")
#             result = cursor.fetchone()
#             column_names = [desc[0] for desc in cursor.description]
#             inf = dict(zip(column_names, result))
#             print("aaaaaaaaaaaaaaaaaaaaa", inf)
#             cursor.execute(f"Select * from paymentdetails Where InvNo ='{inv_no}' ")
#             payDetails = cursor.fetchall()
#             column_names = [desc[0] for desc in cursor.description]
#             payDetailList = [dict(zip(column_names, payDetail)) for payDetail in payDetails]
#             cursor.execute(f" Select `Index` from inv where InvNo= '{inv_no}' Group By `Index` ")
#             extract_indexes = cursor.fetchall()
#             inv_list = []
#             if extract_indexes and extract_indexes[0][0] is not None:

#                 for e_index_row in extract_indexes:
#                     e_index = e_index_row[0]
#                     query = f" Select inv.*, items.ItemName from inv left join items on inv.ItemNo = items.ItemNo where inv.Index = {e_index} and inv.InvNo = '{inv_no}' and inv.GroupNo != 'MOD' "
#                     cursor.execute(query)
#                     princ_items = cursor.fetchone()
#                     column_names = [desc[0] for desc in cursor.description]
#                     princ_item = dict(zip(column_names, princ_items))
#                     query2 = f" Select inv.*, items.ItemName from inv left join items on inv.ItemNo = items.ItemNo Where inv.InvNo = '{inv_no}' and inv.Index = {e_index} and inv.GroupNo = 'MOD' "
#                     print(query2)
#                     cursor.execute(query2)
#                     item_mods = cursor.fetchall()
#                     column_names = [desc[0] for desc in cursor.description]
#                     item_mod = [dict(zip(column_names, imod)) for imod in item_mods]
#                     item = {
#                         "ItemNo": princ_item["ItemNo"],
#                         "ItemName": princ_item["ItemName"],
#                         "Printed": princ_item["Printed"],
#                         "UPrice": princ_item["UPrice"],
#                         "Disc": princ_item["Disc"],
#                         "Tax": princ_item["Tax"],
#                         "quantity": princ_item["Qty"],
#                         "KT1": princ_item["KT1"],
#                         "KT2": princ_item["KT2"],
#                         "KT3": princ_item["KT3"],
#                         "KT4": princ_item["KT4"],
#                         "index": princ_item["Index"],
#                         "GroupNo": princ_item["GroupNo"],
#                         "chosenModifiers": [
#                             {"ItemNo": itemod["ItemNo"], "ItemName": itemod["ItemName"]}
#                             for itemod in item_mod
#                         ]
#                     }
#                     inv_list.append(item)
#                 return {"inv_list": inv_list, "invNo": inv_no, "inf": inf, "invType": inv_type, "recallDate": recallDate, "recallTime":recallTime, "payDetailList": payDetailList }
#         return {"message": "No invoice with this number"}
#     except HTTPException as e:
#         print("Error details:", e.detail)
#         raise e
#     finally:
#         if conn:
#             conn.close()

@app.post("/pos/getBackInv/{company_name}/{loggedType}")
async def getBackInv(company_name: str, loggedType: str, request: Request):
    conn = None
    try:
        conn = get_db(company_name)
        cursor = conn.cursor(buffered=True)  # Use buffered cursor
        inv_type = loggedType
        data = await request.json()

        # If message exists in request data, fetch invoice less than the message
        if data.get("message"):
            message = int(data["message"])
            cursor.execute(
                "SELECT InvNo, Date, Time, Eod,InvKind FROM invnum WHERE InvType = %s AND InvNo < %s ORDER BY InvNo DESC LIMIT 1", 
                (inv_type, message)
            )
            result = cursor.fetchone()
        else:
            cursor.execute(
                "SELECT InvNo, Date, Time, Eod,InvKind FROM invnum WHERE InvType = %s ORDER BY InvNo DESC LIMIT 1",
                (inv_type,)
            )
            result = cursor.fetchone()

        if result:
            inv_no = result[0]
            recallDate = result[1]
            recallTime = result[2]
            eod = result[3]
            inv_kind = result[4]
        else:
            return {"message": "No invoice found."}

        # Check if Eod is NULL or empty
        if eod not in (None, ''):
            return {"message": "No invoice available."}
        
        print("invvvvv no", inv_no)
        print("invvv typeeeeeeee", inv_type)

        # Query to check if invoice exists in the `inv` table
        existing_table_query = """
            SELECT *
            FROM inv
            WHERE InvNo = %s and InvType = %s LIMIT 1
        """
        
        cursor.execute(existing_table_query, (inv_no, inv_type))
        existing_inv = cursor.fetchone()
        print("existingggg", existing_inv)

        if existing_inv:
            print("anaafafafaagag")
            cursor.execute("SELECT Disc, Srv FROM invnum WHERE InvNo = %s", (inv_no,))
            result = cursor.fetchone()
            
            if result:
                column_names = [desc[0] for desc in cursor.description]
                inf = dict(zip(column_names, result))
                print("aaaaaaaaaaaaaaaaaaaaa", inf)
            else:
                inf = {}

            # Get payment details
            cursor.execute("SELECT * FROM paymentdetails WHERE InvNo = %s", (inv_no,))
            payDetails = cursor.fetchall()

            # Handle payment details properly
            column_names = [desc[0] for desc in cursor.description]
            payDetailList = [dict(zip(column_names, payDetail)) for payDetail in payDetails]

            # Fetch all invoice indexes
            cursor.execute("SELECT `Index` FROM inv WHERE InvNo = %s GROUP BY `Index`", (inv_no,))
            extract_indexes = cursor.fetchall()

            inv_list = []

            if extract_indexes and extract_indexes[0][0] is not None:
                for e_index_row in extract_indexes:
                    e_index = e_index_row[0]

                    # Query for principal items
                    query = """
                        SELECT inv.*, items.ItemName 
                        FROM inv 
                        LEFT JOIN items ON inv.ItemNo = items.ItemNo 
                        WHERE inv.Index = %s AND inv.InvNo = %s AND inv.GroupNo != 'MOD'
                    """
                    cursor.execute(query, (e_index, inv_no))
                    princ_items = cursor.fetchone()

                    if princ_items:
                        column_names = [desc[0] for desc in cursor.description]
                        princ_item = dict(zip(column_names, princ_items))

                        # Query for modifier items
                        query2 = """
                            SELECT inv.*, items.ItemName 
                            FROM inv 
                            LEFT JOIN items ON inv.ItemNo = items.ItemNo 
                            WHERE inv.InvNo = %s AND inv.Index = %s AND inv.GroupNo = 'MOD'
                        """
                        cursor.execute(query2, (inv_no, e_index))
                        item_mods = cursor.fetchall()

                        column_names = [desc[0] for desc in cursor.description]
                        item_mod = [dict(zip(column_names, imod)) for imod in item_mods]

                        item = {
                            "ItemNo": princ_item["ItemNo"],
                            "ItemName": princ_item["ItemName"],
                            "Printed": princ_item["Printed"],
                            "UPrice": princ_item["UPrice"],
                            "Disc": princ_item["Disc"],
                            "Tax": princ_item["Tax"],
                            "quantity": princ_item["Qty"],
                            "KT1": princ_item["KT1"],
                            "KT2": princ_item["KT2"],
                            "KT3": princ_item["KT3"],
                            "KT4": princ_item["KT4"],
                            "index": princ_item["Index"],
                            "GroupNo": princ_item["GroupNo"],
                            "chosenModifiers": [
                                {"ItemNo": itemod["ItemNo"], "ItemName": itemod["ItemName"]}
                                for itemod in item_mod
                            ]
                        }
                        inv_list.append(item)

                return {
                    "inv_list": inv_list,
                    "invNo": inv_no,
                    "inf": inf,
                    "invType": inv_type,
                    "recallDate": recallDate,
                    "recallTime": recallTime,
                    "payDetailList": payDetailList,
                    "invKind": inv_kind
                }

        return {"message": "No invoice with this number"}
    
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    
    finally:
        if conn:
            conn.close()


@app.post("/pos/getNextInv/{company_name}/{loggedType}")
async def getNextInv(company_name: str, loggedType: str, request: Request,):
    conn = None
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        inv_type = loggedType
        data = await request.json()
        
        if data["message"]:  
            message = int(data["message"])
            cursor.execute("SELECT InvNo, Date, Time FROM invnum WHERE InvType = %s AND InvNo > %s ORDER BY InvNo ASC LIMIT 1", 
               (loggedType, message))
            result = cursor.fetchone()
            inv_no = result[0] if result else None
            recallDate = result[1] if result else None
            recallTime = result[2] if result else None
        else:
            return
        
        print("invvvvv no", inv_no)
        print("invvv typeeeeeeee", inv_type)
        # Check if the updated ItemNo already exists and is not the same as the original one
        existing_table_query = """
                    SELECT *
                    FROM inv
                    WHERE InvNo = %s and InvType = %s LIMIT 1
                """
        cursor.execute(existing_table_query, (inv_no,inv_type))
        existing_inv = cursor.fetchone()
        # Get column names from cursor.description if result set exists
        if existing_inv:
            cursor.execute(f"Select Disc, Srv,InvKind from invnum where InvNo ='{inv_no}'")
            result = cursor.fetchone()
            disc, srv,inv_kind = result
            cursor.execute(f"Select * from paymentdetails Where InvNo ='{inv_no}' ")
            payDetails = cursor.fetchall()
            column_names = [desc[0] for desc in cursor.description]
            payDetailList = [dict(zip(column_names, payDetail)) for payDetail in payDetails]
            cursor.execute(f" Select `Index` from inv where InvNo= '{inv_no}' Group By `Index` ")
            extract_indexes = cursor.fetchall()
            inv_list = []
            if extract_indexes and extract_indexes[0][0] is not None:

                for e_index_row in extract_indexes:
                    e_index = e_index_row[0]
                    query = f" Select inv.*, items.ItemName from inv left join items on inv.ItemNo = items.ItemNo where inv.Index = {e_index} and inv.InvNo = '{inv_no}' and inv.GroupNo != 'MOD' "
                    cursor.execute(query)
                    princ_items = cursor.fetchone()
                    column_names = [desc[0] for desc in cursor.description]
                    princ_item = dict(zip(column_names, princ_items))
                    query2 = f" Select inv.*, items.ItemName from inv left join items on inv.ItemNo = items.ItemNo Where inv.InvNo = '{inv_no}' and inv.Index = {e_index} and inv.GroupNo = 'MOD' "
                    cursor.execute(query2)
                    item_mods = cursor.fetchall()
                    column_names = [desc[0] for desc in cursor.description]
                    item_mod = [dict(zip(column_names, imod)) for imod in item_mods]
                    item = {
                        "ItemNo": princ_item["ItemNo"],
                        "ItemName": princ_item["ItemName"],
                        "Printed": princ_item["Printed"],
                        "UPrice": princ_item["UPrice"],
                        "Disc": princ_item["Disc"],
                        "Tax": princ_item["Tax"],
                        "quantity": princ_item["Qty"],
                        "KT1": princ_item["KT1"],
                        "KT2": princ_item["KT2"],
                        "KT3": princ_item["KT3"],
                        "KT4": princ_item["KT4"],
                        "index": princ_item["Index"],
                        "GroupNo": princ_item["GroupNo"],
                        "chosenModifiers": [
                            {"ItemNo": itemod["ItemNo"], "ItemName": itemod["ItemName"]}
                            for itemod in item_mod
                        ]
                    }
                    inv_list.append(item)
                return {"inv_list": inv_list, "invNo": inv_no, "disc": disc, "srv": srv, "invType": inv_type, "recallDate": recallDate, "recallTime": recallTime, "payDetailList": payDetailList,"invKind": inv_kind }
        return {"message": "No invoice with this number"}
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        if conn:
            conn.close()

@app.get("/pos/Visa/{company_name}")
async def getVisa(company_name: str):
    conn = None
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        cursor.execute(f"SELECT Visa FROM visa")
        visa_tuple = cursor.fetchall()
        
        if visa_tuple is None:
            return {"error": "No Visa data found"}

        # Convert the tuple to a list, excluding None values
        visa_list = [visa for visa in visa_tuple if visa is not None]
        
        print("Visa List:", visa_list)
        return visa_list
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        if conn:
            conn.close()


@app.get("/pos/getAmountsCurrency/{company_name}/{amount_code}")
async def getAmountsCurrency(company_name: str, amount_code: str):
    conn = None
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        print("currency code", amount_code)
        cursor.execute(f"SELECT amount FROM currencyamount WHERE Code='{amount_code}' ")
        amount_details = cursor.fetchall()
         # Extract amounts from the tuples into a flat list
        amountList = [amount[0] for amount in amount_details]
        
        print("amounts List:", amountList)
        return amountList
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        if conn:
            conn.close()

@app.get("/pos/getAllCurrencies/{company_name}")
async def getAllCurrencies(company_name: str):
    conn = None
    try:
        conn = get_db(company_name)
        cursor = conn.cursor()
        cursor.execute(f"Select * from currencies ")
        currencyDetails = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        currencyList = [dict(zip(column_names, currencyDetail)) for currencyDetail in currencyDetails]
        
        print("currency List:", currencyList)
        return currencyList
    except HTTPException as e:
        print("Error details:", e.detail)
        raise e
    finally:
        if conn:
            conn.close()
# @app.post("/pos/subCash/{company_name}")
# async def getNextInv(company_name: str, request: Request,):
#     conn = None
#     try:
#         conn = get_db(company_name)
#         cursor = conn.cursor()
#         data = await request.json()
#         cursor.execute(
#             """
#             INSERT INTO pay (InvNo, PayType, CurrUSDIn, CurrUSDOut, CurrLBPIn, CurrLBPOut) 
#             VALUES (%s, %s, %s, %s, %s, %s)
#             """,
#             (
#                 data["message"],
#                 data["paymentMethod"],
#                 data["payInUSD"],
#                 data["payOutUSD"],
#                 data["payInLBP"],
#                 data["payOutLBP"],
#             )
#         )
#         conn.commit()
#         return {"message": "Inserted"}
#     except HTTPException as e:
#         print("Error details:", e.detail)
#         raise e
#     finally:
#         if conn:
#             conn.close()


if __name__ == "__main__":
    uvicorn.run("main:app", host="192.168.1.111", port=8000, reload=False, log_level="debug", debug=True)