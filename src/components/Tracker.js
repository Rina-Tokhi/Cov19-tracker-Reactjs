import React, { Component } from 'react';
import GlobalStatus from './global/GlobalStatus';
import CountryStatus from './country/CountryStatus';
import CountriesTable from './CountriesTable';
import Footer from './Footer';
import { allCountriesLink } from '../util';


export const CountryCodeContext = React.createContext();
class Tracker extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: null,
            country: false,
            show: true
        }
    }

    componentDidMount() {
        this.getAllCountriesData();

    }
    getAllCountriesData = async () => {
        let data = await fetch(allCountriesLink);
        data = await data.json();
        this.setState({ data: data }, this.handleGetLocation);
    }
    handleCountryChange = (countryCode) => {
        this.setState({ country: countryCode })
        let bodyTag = document.getElementsByTagName('body')[0].getBoundingClientRect().y;
        let el = document.getElementById("chart").getBoundingClientRect().y;
        window.scrollTo(0, Math.abs(bodyTag) - Math.abs(el))
    }
    handleGetLocation = (countryCodeFromSearch = false) => {
        console.log("location");
        if (!countryCodeFromSearch) {
            if (window.navigator.geolocation) {
                window.navigator.geolocation.getCurrentPosition(e => {

                    let { data } = this.state;
                    const lat = e.coords.latitude.toFixed(2);
                    const lng = e.coords.longitude.toFixed(2);

                    for (let i = 0; i < data.length; i++) {
                        if (data[i].lat === null || data[i].lng === null) {
                            continue;
                        }
                        let dataLat = data[i].lat.toFixed(2);
                        let dataLng = data[i].lng.toFixed(2);
                        if (((lat + 4) >= dataLat && (lat - 4) <= dataLat) && (lng + 4) >= dataLng && (lng - 4) <= dataLng) {

                            this.setState({
                                show: false,
                                country: data[i].countryCode
                            })
                            break;
                        }

                    }
                })
            }
        } else {
            this.setState({
                show: false,
                country: countryCodeFromSearch
            })
        }


    }
    render() {
        const cls = "z-40 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8";
        console.log(this.state)
        return (
            <main className="container xl:px-10 2xl:px-40 mx-auto">
                <div className={cls}>
                    <CountryCodeContext.Provider value={[this.state.data, this.handleCountryChange, this.state.country]}>
                        <GlobalStatus />
                        <CountryStatus
                            country={this.state.country}
                            data={this.state.data}
                            show={this.state.show}
                            handleGetLocation={this.handleGetLocation}
                        />
                        {
                            this.state.data && <CountriesTable
                            // handleCountryChange={this.handleCountryChange}
                            // data={this.state.data}
                            />
                        }
                    </CountryCodeContext.Provider>

                    <Footer />


                </div>
            </main>
        )
    }
}

export default Tracker
