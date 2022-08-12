import React, { useEffect, useState } from 'react';
import './styles.css'

import axios from 'axios'
import InputsContainer from '../components/inputsContainer/InputsContainer';
import { AxiosError } from 'axios';
import { Button } from '@mui/material';
import Title from '../components/title/Title';

type SetProps = Object | null | any

function Main() {

    const [airports, setAirports] = useState([]);
    const [from, setFrom] = useState<SetProps>(null);
    const [to, setTo] = useState<SetProps>(null);
    const [distanceNMresult, setdistanceNMresult] = useState(0)
    async function getUsAirports() {
        try {
            // return axios.get(`https://airlabs.co/api/v9/airports?api_key=c713bd92-d8c6-4cbb-b64a-7688ad1260b4&country_code=US`);
            return axios.get(`http://localhost:3000/airports.json`);
        } catch (error) {
            console.log(error)
        }
    }

    const distance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        let p = 0.017453292519943295;
        let c = Math.cos;
        let a = 0.5 - c((lat2 - lat1) * p) / 2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p)) / 2;

        let km = 12742 * Math.asin(Math.sqrt(a));
        let nauticalMiles = km / 1.852
        return nauticalMiles
    }



    useEffect(() => {
        (async function () {
            try {
                const res = await getUsAirports();
                const airports: any = res?.data.response;
                setAirports(airports)
            } catch (error: unknown) {
                if (!(error instanceof AxiosError)) { throw error; }
                console.log(error.message)
            }

        })();
    }, [])

    useEffect(() => {
        if (from && to) {
            const { lng: lng1, lat: lat1 } = from
            const { lng: lng2, lat: lat2 } = to
            let distancNM = distance(lat1, lng1, lat2, lng2)
            setdistanceNMresult(distancNM)
        }
    }, [from, to])

    const setAirportsForDistance = (value: Object, label: string) => {
        if (label === 'from') {
            setFrom(value)
        } else if (label === 'to') {
            setTo(value)
        }
    }

    function resetVal() {
        setdistanceNMresult(0)
    }

    return (
        <>
            <div className='wrapper'>
                <Title />
                <div className='content'>
                    <div className=''>
                        <InputsContainer distanceprop={distanceNMresult} handleCalculateDistance={setAirportsForDistance} airports={airports} />
                    </div>

                    <Button className='btn' onClick={resetVal} variant="outlined">Reset</Button>

                </div>

            </div>

        </>
    )
}

export default Main