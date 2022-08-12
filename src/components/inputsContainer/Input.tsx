import React from 'react' 
import { Stack, Autocomplete, TextField, createFilterOptions,  } from '@mui/material'

function Input({airports, label, handleCalculateDistance}:any) {

  const OPTIONS_LIMIT = 10;
  const filterOptions:any = createFilterOptions({
    limit: OPTIONS_LIMIT
  });

  return (
    <Stack spacing={2} width="250px" margin={2}>
        <Autocomplete 
            isOptionEqualToValue={(option, value) => option.name === value.name}
             sx={{ width: 250 }}
            options={airports}
            filterOptions={filterOptions}
            onChange={(e:any, value:any) => { 
              handleCalculateDistance(value, label)
            }}
            renderOption={(props, option) => {
              return (
                <li {...props} key={`${option.icao_code}-${option.iata_code}`}>
                  {option.name}
                </li>
              );
            }}
            renderInput={(params)=> <TextField {...params} label={label}/> } 
            getOptionLabel={(option:any) => option.name}
          />
    </Stack>
  )
}

export default Input