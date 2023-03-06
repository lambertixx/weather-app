import axios from "axios"
import { config } from "dotenv"
import { WeatherApiResponse } from "./interfaces/apiResponse"
config()

const apiKey = process.env.WEATHER_API_KEY

function unixTimeConverter(unixTimeStamp: number) {
    const dateTime = new Date(unixTimeStamp * 1000)
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
    const year = dateTime.getFullYear()
    const month = months[dateTime.getMonth()]
    const date = dateTime.getDate()
    const hour = dateTime.getHours()
    const min = dateTime.getMinutes()
    const sec = dateTime.getSeconds()
    const time = `${date} de ${month} de ${year} às ${hour}:${min}:${sec}`
    return time
}

async function getLatLon(cityName: string, stateCode: string, countryCode: string) {
    const baseUrl = `${process.env.GEOLOCATION_BASE_URL}q=${cityName},${stateCode},${countryCode}&limit=10&appid=${apiKey}`
    const request = await axios.get(baseUrl)
    const response = request.data[0]
    const latLon = {
        lat: response.lat,
        lon: response.lon
    }
    return latLon
}

async function getWeather(cityName: string, stateCode: string, countryCode: string) {
    const latLon = await getLatLon(cityName, stateCode, countryCode)
    const lat = latLon.lat
    const lon = latLon.lon

    const baseUrl = `${process.env.WEATHER_BASE_URL}lat=${lat}&lon=${lon}&appid=${apiKey}&lang=pt_br&units=metric`
    const request = await axios.get(baseUrl)
    const response: WeatherApiResponse = request.data
    const weather = {
        city: `${cityName}, ${stateCode} - ${countryCode}`,
        weather: response.weather[0].main,
        description: response.weather[0].description,
        temperature: `${response.main.temp}°C`,
        windChill: `${response.main.feels_like}°C`,
        minTemperature: `${response.main.temp_min}°C`,
        maxTemperature: `${response.main.temp_max}°C`,
        atmosphericPressure: `${response.main.pressure}hPa`,
        airHumidity: `${response.main.humidity}%`,
        windSpeed: `${response.wind.speed}m/s`,
        windDirection: `${response.wind.deg}°`,
        dateTime: unixTimeConverter(response.dt),
        sunrise: unixTimeConverter(response.sys.sunrise),
        sunset: unixTimeConverter(response.sys.sunset)
    }
    console.log(weather)
    return weather
}

getWeather("São Bernardo do Campo", "SP", "BR")
