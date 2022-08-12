import Input from './Input'
import './styles.css'

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
                    <span>Distance in Nautical Miles: {props.distanceprop.toFixed(2)}</span>
                 )}
              
            </div>
        </div>

    )
}

export default InputsContainer