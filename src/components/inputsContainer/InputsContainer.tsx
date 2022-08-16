import Input from './Input'
import './styles.css'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';


type Props = {
    distanceprop: number;
    airports: string[];
    handleCalculateDistance: (value: Object, label: string) => void
}

const InputsContainer = (props: Props) => {



    return (
        <div className='container'>
            <div className='input-wrapper'>
                <Input handleCalculateDistance={props.handleCalculateDistance} airports={props.airports} label="from" />
                <Input handleCalculateDistance={props.handleCalculateDistance} airports={props.airports} label="to" />
            </div>
            <div className='text'>
                {props.distanceprop !== 0 && (
                    <Card>
                        <CardContent>
                    
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            Distance in Nautical Miles: {props.distanceprop.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>

                )}

            </div>

        </div>

    )
}

export default InputsContainer