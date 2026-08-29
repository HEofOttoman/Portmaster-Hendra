// # Javascript code example from the url builder at https://open-meteo.com/en/docs

import { fetchWeatherApi } from "openmeteo";

const locationStringNames = ["New York City", "Canberra", "Jakarta", "Nairobi"];
// const locationImages = ["New York City", "Canberra", "Jakarta", "Nairobi"]; // Insert cdn links for future drawings of the cities

const params = {
	// Coordinates for (in order) New York, Canberra, Jakarta & Nairobi.
	latitude: [40.7143, -35.2835, -6.2146, -1.2833],
	longitude: [-74.006, 149.1281, 106.8451, 36.8167],
	daily: ["temperature_2m_max", "temperature_2m_min", "sunrise", "sunset", "uv_index_max", "rain_sum", "precipitation_probability_max", "temperature_2m_mean", "weather_code"],
	hourly: ["temperature_2m", "showers", "snowfall", "snow_depth", "rain", "precipitation", "weather_code"],
	current: ["temperature_2m", "precipitation", "rain", "showers", "snowfall", "is_day", "apparent_temperature", "weather_code", "cloud_cover"],
	timezone: "auto",
	// forecast_days: 1,
	forecast_hours: 24,
	timeformat: "unixtime",
};
const url = "https://api.open-meteo.com/v1/forecast";
// const responses = await fetchWeatherApi(url, params);


// Process 4 locations
/*for (const response of responses) {
	// Attributes for timezone and location
	const latitude = response.latitude();
	const longitude = response.longitude();
	const elevation = response.elevation();
	const timezone = response.timezone();
	const timezoneAbbreviation = response.timezoneAbbreviation();
	const utcOffsetSeconds = response.utcOffsetSeconds();
	
	// console.log(`\nLocation: ${locationStringNames.at(responses.findIndex(response))}`)

	console.log(
		`\nCoordinates: ${latitude}°N ${longitude}°E`,
		`\nElevation: ${elevation}m asl`,
		`\nTimezone: ${timezone} ${timezoneAbbreviation}`,
		`\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`,
	);
	
	const hourly = response.hourly()!;
	const current = response.current()!;
	const daily = response.daily()!;

	// Define Int64 variables so they can be processed accordingly
	const sunrise = daily.variables(2)!;
	const sunset = daily.variables(3)!;
	
	// Note: The order of weather variables in the URL query and the indices below need to match!
	const weatherData = {
		current: {
			// time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000 ), // utcOffsetSeconds pushes things in the future because current.time() is already present
			time: new Date((Number(current.time())) * 1000 ),
			temperature_2m: current.variables(0)!.value(),
			precipitation: current.variables(1)!.value(),
			rain: current.variables(2)!.value(),
			showers: current.variables(3)!.value(),
			snowfall: current.variables(4)!.value(),
			is_day: current.variables(5)!.value(),
			apparent_temperature: current.variables(6)!.value(),
			weather_code: current.variables(7)!.value(),
			cloud_cover: current.variables(8)!.value(),
		},
		
		hourly: {
			time: Array.from(
				{ length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() }, 
				(_ , i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
			),
			temperature_2m: hourly.variables(0)!.valuesArray(),
			showers: hourly.variables(1)!.valuesArray(),
			snowfall: hourly.variables(2)!.valuesArray(),
			snow_depth: hourly.variables(3)!.valuesArray(),
			rain: hourly.variables(4)!.valuesArray(),
			precipitation: hourly.variables(5)!.valuesArray(),
			weather_code: hourly.variables(6)!.valuesArray(),
		},

		daily: {
			time: Array.from(
				{ length: (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval() }, 
				(_ , i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
			),
			temperature_2m_max: daily.variables(0)!.valuesArray(),
			temperature_2m_min: daily.variables(1)!.valuesArray(),
			// Map Int64 values to according structure
			sunrise: [...Array(sunrise.valuesInt64Length())].map(
				(_ , i) => new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000)
			),
			// Map Int64 values to according structure
			sunset: [...Array(sunset.valuesInt64Length())].map(
				(_ , i) => new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000)
			),uv_index_max: daily.variables(4)!.valuesArray(),
			rain_sum: daily.variables(5)!.valuesArray(),
			precipitation_probability_max: daily.variables(6)!.valuesArray(),
			temperature_2m_mean: daily.variables(7)!.valuesArray(),
			weather_code: daily.variables(8)!.valuesArray(),

		}
	};

	// Fix same time duplication bug
	const localTimeFormatted = weatherData.current.time.toLocaleString("en-AU", {
		timeZone: `${timezone}`, // e.g., "America/New_York", "Asia/Jakarta"
		dateStyle: "full",
		timeStyle: "medium"
	});

	// The 'weatherData' object now contains a simple structure, with arrays of datetimes and weather information
	console.log(
		// `\nCurrent time: ${weatherData.current.time}\n`,
		`\nCurrent time: ${localTimeFormatted}\n`,
		`\nCurrent temperature_2m: ${weatherData.current.temperature_2m}`,
		`\nCurrent precipitation: ${weatherData.current.precipitation}`,
		`\nCurrent rain: ${weatherData.current.rain}`,
		`\nCurrent showers: ${weatherData.current.showers}`,
		`\nCurrent snowfall: ${weatherData.current.snowfall}`,
		`\nCurrent is_day: ${weatherData.current.is_day}`,
		`\nCurrent apparent_temperature: ${weatherData.current.apparent_temperature}`,
		`\nCurrent weather_code: ${weatherData.current.weather_code}`,
		`\nCurrent cloud_cover: ${weatherData.current.cloud_cover}`,
	);
	// console.log("\nHourly data:\n", weatherData.hourly)
	// console.log("\Daily data:\n", weatherData.daily)
}*/

export interface currentWeather {
	time: Date;
	temperature: number;
	precipitation: number;
	rain: number;
	showers: number;
	snowfall: number;
	isDay: boolean;
	weatherCode: number;
	clouds: number;
};
export interface localWeather {
	name: string;
	timezone: string;
	timezoneAbbreviation: string;
	elevation: number;
	weatherCurrent: currentWeather;
};

// Helper function to get local time
export function getLocalTime(locationData: localWeather) {
	const localTimeFormatted = locationData.weatherCurrent.time.toLocaleDateString("en-AU", {
		timeZone: `${locationData.timezone}`,
		dateStyle: "full",
	})
	return localTimeFormatted;
}
	
// Makes block kit json payload
export function buildPayload(locations: localWeather[]) {
	return { // taken fromn updateTemplate.json
	blocks: [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `It is currently ${new Date().toLocaleTimeString()}. Here's how weather's looking elsewhere:`
			}
		},
		{	"type": "divider"	},
		{
			"type": "carousel",
			"elements": locations.map((loc, index) => ({
				"type": "card",
				// "hero_image": {"type": "image", "image_url": `https://ingo.au/canberra.svg`, "alt_text": "Canberra"},
				"block_id": `location-card-${index}`,
				"title": {
					"type": "mrkdwn",
					// "text": loc.name,
					"text": locationStringNames[index] || loc.name,
				},
				"subtitle": {
					"type": "mrkdwn",
					"text": loc.weatherCurrent.time.toLocaleTimeString("en-AU", {
						timeZone: loc.timezone,
					})
				},
				"body": {
					"type": "mrkdwn",
					"text": `_${loc.name}_\n*Temperature*: ${loc.weatherCurrent.temperature}°C\n*Precipitation*: ${loc.weatherCurrent.precipitation}mm,\n*Rain*: ${loc.weatherCurrent.rain}%,\n*Showers*: ${loc.weatherCurrent.showers},\n*Snowfall*: ${loc.weatherCurrent.snowfall},\n*Daytime?*: ${loc.weatherCurrent.isDay},\n*Weather Code*: ${loc.weatherCurrent.weatherCode},\n*Clouds*: ${loc.weatherCurrent.clouds},\n`
				}
			})
		)},
		{	"type": "divider"	},
	],
	};
};

// Parses data
export async function fetchWeatherData() {
	// okay cleaning up this architecture
	// This should like get purely the current weather, returning values, which would be parsed by another function?
	try {
		const data = await fetchWeatherApi(url, params);

		const dataParsed: localWeather[] = []

		for (const response of data) {			
			const latitude = response.latitude();
			const longitude = response.longitude();
			const elevation = response.elevation();
			const timezone = response.timezone();
			const timezoneAbbreviation = response.timezoneAbbreviation();
			const utcOffsetSeconds = response.utcOffsetSeconds();

			// const hourly = response.hourly()!;
			const current = response.current()!;
			// const daily = response.daily()!;

			// Define Int64 variables so they can be processed accordingly
			// const sunrise = daily.variables(2)!;
			// const sunset = daily.variables(3)!;

			const weatherData: localWeather = {
				name: `${latitude}°N ${longitude}°E`,
				timezone: timezone ?? "UTC +john",
				timezoneAbbreviation: timezoneAbbreviation ?? utcOffsetSeconds.toString(),
				elevation: elevation,

				weatherCurrent: {
					time: new Date((Number(current.time())) * 1000 ),
					// temperature_2m: current.variables(0)!.value(),
					temperature: current.variables(0)!.value(), // renamed from temp_2m
					precipitation: current.variables(1)!.value(),
					rain: current.variables(2)!.value(),
					showers: current.variables(3)!.value(),
					snowfall: current.variables(4)!.value(),
					isDay: Boolean(current.variables(5)!.value()),
					// apparent_temperature: current.variables(6)!.value(),
					weatherCode: current.variables(7)!.value(),
					clouds: current.variables(8)!.value(),

				},
				
				/*hourly: {
					time: Array.from(
						{ length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() },
						(_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
					),
					temperature_2m: hourly.variables(0)!.valuesArray(),
					showers: hourly.variables(1)!.valuesArray(),
					snowfall: hourly.variables(2)!.valuesArray(),
					snow_depth: hourly.variables(3)!.valuesArray(),
					rain: hourly.variables(4)!.valuesArray(),
					precipitation: hourly.variables(5)!.valuesArray(),
					weather_code: hourly.variables(6)!.valuesArray(),
				},
				daily: {
					time: Array.from(
						{ length: (Number(daily.timeEnd()) - Number(daily.time())) / hourly.interval() },
						(_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
					),
					temperature_2m_max: daily.variables(0)!.valuesArray,
					temperature_2m_min: daily.variables(1)!.valuesArray,

					// map int64 values
					sunrise: [...Array(sunrise.valuesInt64Length())].map(
						(_, i) => new Date((Number(sunrise.valuesInt64(i))))
					),
					sunset: [...Array(sunset.valuesInt64Length())].map(
						(_, i) => new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds * 1000))
					),
					uv_index_max: daily.variables(4)!.valuesArray(),
					rain_sum: daily.variables(5)!.valuesArray(),
					precipitation_probability_max: daily.variables(6)!.valuesArray(),
					temperature_2m_mean: daily.variables(7)!.valuesArray(),
					weather_code: daily.variables(8)!.valuesArray(),

				}*/
			}

			/*const localTimeFormatted = weatherData.weatherCurrent.time.toLocaleDateString("en-AU", {
				timeZone: `${timezone}`,
				dateStyle: "full",
				// timeStyle: "medium"
			})*/

			dataParsed.push(weatherData);
		}

		return dataParsed;
	} catch(error) {
		console.error("sorry, I couldn't fetch any weather data 🥀, Openmeteo API Error: ", error);
		return;
	}
}

/*export async function getCurrentWeather() {
	// const newdataresponse = await fetchWeatherApi(url, params);
	
	await weatherupdateTemplate;
	
	try {
		const data = await fetchWeatherApi(url, params);

		const messages = [];
		for (const response of data) {			
			const latitude = response.latitude();
			const longitude = response.longitude();
			const elevation = response.elevation();
			const timezone = response.timezone();
			const timezoneAbbreviation = response.timezoneAbbreviation();
			const utcOffsetSeconds = response.utcOffsetSeconds();

			const hourly = response.hourly()!;
			const current = response.current()!;
			const daily = response.daily()!;

			// Define Int64 variables so they can be processed accordingly
			const sunrise = daily.variables(2)!;
			const sunset = daily.variables(3)!;

			const weatherData = {
				current: {
					time: new Date((Number(current.time())) * 1000 ),
					temperature_2m: current.variables(0)!.value(),
					precipitation: current.variables(1)!.value(),
					rain: current.variables(2)!.value(),
					showers: current.variables(3)!.value(),
					snowfall: current.variables(4)!.value(),
					is_day: current.variables(5)!.value(),
					apparent_temperature: current.variables(6)!.value(),
					weather_code: current.variables(7)!.value(),
					cloud_cover: current.variables(8)!.value(),

				},
				
				hourly: {
					time: Array.from(
						{ length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() },
						(_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
					),
					temperature_2m: hourly.variables(0)!.valuesArray(),
					showers: hourly.variables(1)!.valuesArray(),
					snowfall: hourly.variables(2)!.valuesArray(),
					snow_depth: hourly.variables(3)!.valuesArray(),
					rain: hourly.variables(4)!.valuesArray(),
					precipitation: hourly.variables(5)!.valuesArray(),
					weather_code: hourly.variables(6)!.valuesArray(),
				},
				daily: {
					time: Array.from(
						{ length: (Number(daily.timeEnd()) - Number(daily.time())) / hourly.interval() },
						(_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
					),
					temperature_2m_max: daily.variables(0)!.valuesArray,
					temperature_2m_min: daily.variables(1)!.valuesArray,

					// map int64 values
					sunrise: [...Array(sunrise.valuesInt64Length())].map(
						(_, i) => new Date((Number(sunrise.valuesInt64(i))))
					),
					sunset: [...Array(sunset.valuesInt64Length())].map(
						(_, i) => new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds * 1000))
					),
					uv_index_max: daily.variables(4)!.valuesArray(),
					rain_sum: daily.variables(5)!.valuesArray(),
					precipitation_probability_max: daily.variables(6)!.valuesArray(),
					temperature_2m_mean: daily.variables(7)!.valuesArray(),
					weather_code: daily.variables(8)!.valuesArray(),

				}
			}

			const localTimeFormatted = weatherData.current.time.toLocaleDateString("en-AU", {
				timeZone: `${timezone}`,
				dateStyle: "full",
				// timeStyle: "medium"
			})

			messages.push(
				`Current Weather for ${latitude}°N ${longitude}°E in ${timezone} ${timezoneAbbreviation}, at ${localTimeFormatted}. ${elevation} above sea level btw \n
				`
			)
		}
		const payload = messages.join(''); // make array into one string with newlines and nothing else
		console.log(payload);
		return payload;

	} catch (error) {
		console.error("Openmeteo API Error: ", error);
		return "sorry, I couldn't find any weather data 🥀"
	};
};*/
