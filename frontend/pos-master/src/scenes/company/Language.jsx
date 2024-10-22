import React from "react";
import { useLanguage } from "../LanguageContext";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import translations from "../translations";
const Language = () => {
  const { language, setLanguage } = useLanguage();
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

 return (
    <FormControl variant="outlined" fullWidth  style={{ paddingLeft: '24px', paddingRight: '24px',marginTop:'10px' }}>
       <InputLabel id="language-label" style={{ paddingLeft: '30px'}}>{translations[language].language}</InputLabel>
      <Select
        labelId="language-label"
        value={language}
        onChange={handleLanguageChange}
        label={translations[language].language}
      >
        <MenuItem value="en">{translations[language].English}</MenuItem>
        <MenuItem value="ar">{translations[language].Arabic}</MenuItem>
      </Select>
    </FormControl>
  );
};

//   return (
//     <div> 
//       <label>
//         Language:
//         <select value={language} onChange={handleLanguageChange}>
//           <option value="en">English</option>
//           <option value="ar">Arabic</option>
//         </select>
//       </label>
//     </div>
//   );
// };

export default Language;
