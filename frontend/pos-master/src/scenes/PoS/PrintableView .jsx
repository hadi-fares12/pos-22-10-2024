const PrintableView = ({
  id,
  selectedMeals,
  grossTotal,
  srv,
  serviceValue,
  discValue,
  discountValue,
  totalDiscount,
  totalTax,
  finalTotal,
}) => {
  const getItemListHTML = () => {
    return selectedMeals
      .map(
        (selectedMeal) => `
      <div>
        <p>${selectedMeal.ItemName} x${selectedMeal.quantity}</p>
        <p>Price: $${(
          selectedMeal.UPrice -
          (selectedMeal.UPrice * selectedMeal.Disc) / 100
        ).toFixed(2)}</p>
        ${
          selectedMeal.chosenModifiers
            ? `<p>Modifiers: ${selectedMeal.chosenModifiers
                .map((modifier) => modifier.ItemName)
                .join(", ")}</p>`
            : ""
        }
      </div>
    `
      )
      .join("");
  };

  return `
    <div  id="${id}">
      <h1>Your Order</h1>
      ${getItemListHTML()}
      <div>
        <h2>Payment Summary</h2>
        <p>Gross Total: $${grossTotal}</p>
        <p>Service: ${srv}% ($${serviceValue.toFixed(2)})</p>
        <p>Discount: ${discValue}% ($${discountValue.toFixed(2)})</p>
        <p>Total Discount: $${totalDiscount.toFixed(2)}</p>
        <p>Tax: ${
          selectedMeals.length > 0 ? selectedMeals[0].Tax : 0
        }% ($${totalTax.toFixed(2)})</p>
        <p>Total: $${finalTotal.toFixed(2)}</p>
      </div>
    </div>
  `;
};

export default PrintableView;
