// # Javascript code example from the url builder at https://open-meteo.com/en/docs

import { fetchWeatherApi } from "openmeteo";

const params = {
	latitude: [40.7143, -35.2835, -6.2146, -1.2833],
	longitude: [-74.006, 149.1281, 106.8451, 36.8167],
	hourly: ["temperature_2m", "showers", "snowfall", "snow_depth", "rain", "precipitation", "weather_code"],
	timezone: "Australia/Sydney",
	forecast_days: 1,
};
const url = "https://api.open-meteo.com/v1/forecast";
const responses = await fetchWeatherApi(url, params);

// JSON file for slack blockkit
const weatherupdate_Payload_Template = {
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "It is currenly CURRENT_TIME. Here's how weather's looking elsewhere:"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "carousel",
			"elements": [
				{
					"type": "card",
					"block_id": "carousel-card-1",
					// "icon": {
						// "type": "image",
						// "image_url": "https://picsum.photos/36/36",
						// "alt_text": "Icon"
					// },
					"title": {
						"type": "mrkdwn",
						"text": "LOCATION_NAME",
						"verbatim": false
					},
					"subtitle": {
						"type": "mrkdwn",
						"text": "This is a subtitle",
						"verbatim": false
					},
					// "hero_image": {
					// 	"type": "image",
					// 	"image_url": "https://picsum.photos/400/300",
					// 	"alt_text": "Sample hero image"
					// },
					"body": {
						"type": "mrkdwn",
						"text": "<Insert weather data>",
						"verbatim": false
					},
				},
				{
					"type": "card",
					"block_id": "carousel-card-2",
					// "icon": {
					// 	"type": "image",
					// 	"image_url": "https://picsum.photos/36/36",
					// 	"alt_text": "Icon"
					// },
					"title": {
						"type": "mrkdwn",
						"text": "LOCATION_NAME",
						"verbatim": false
					},
					"subtitle": {
						"type": "mrkdwn",
						"text": "CURRENT_TIME",
						"verbatim": false
					},
					// "hero_image": {
					// 	"type": "image",
					// 	"image_url": "https://picsum.photos/400/300",
					// 	"alt_text": "Sample hero image"
					// },
					"body": {
						"type": "mrkdwn",
						"text": "<Insert weather data>",
						"verbatim": false
					},
					"actions": [
						{
							"type": "button",
							"text": {
								"type": "plain_text",
								"text": "Action Button",
								"emoji": false
							},
							"action_id": "button_action_2"
						}
					]
				},
				{
					"type": "card",
					"block_id": "carousel-card-3",
					// "icon": {
					// 	"type": "image",
					// 	"image_url": "https://picsum.photos/36/36",
					// 	"alt_text": "Icon"
					// },
					"title": {
						"type": "mrkdwn",
						"text": "LOCATION_NAME",
						"verbatim": false
					},
					"subtitle": {
						"type": "mrkdwn",
						"text": "CURRENT_TIME",
						"verbatim": false
					},
					// "hero_image": {
					// 	"type": "image",
					// 	"image_url": "https://picsum.photos/400/300",
					// 	"alt_text": "Sample hero image"
					// },
					"body": {
						"type": "mrkdwn",
						"text": "<Insert weather data>",
						"verbatim": false
					},
				},
				{
					"type": "card",
					"block_id": "carousel-card-4",
					// "icon": {
					// 	"type": "image",
					// 	"image_url": "https://picsum.photos/36/36",
					// 	"alt_text": "Icon"
					// },
					"title": {
						"type": "mrkdwn",
						"text": "LOCATION_NAME",
						"verbatim": false
					},
					"subtitle": {
						"type": "mrkdwn",
						"text": "CURRENT_TIME",
						"verbatim": false
					},
					// "hero_image": {
					// 	"type": "image",
					// 	"image_url": "https://picsum.photos/400/300",
					// 	"alt_text": "Sample hero image"
					// },
					"body": {
						"type": "mrkdwn",
						"text": "<Insert weather data>",
						"verbatim": false
					},
				}
			]
		},
		{
			"type": "divider"
		}
	]
}

// Process 4 locations
for (const response of responses) {
	// Attributes for timezone and location
	const latitude = response.latitude();
	const longitude = response.longitude();
	const elevation = response.elevation();
	const timezone = response.timezone();
	const timezoneAbbreviation = response.timezoneAbbreviation();
	const utcOffsetSeconds = response.utcOffsetSeconds();
	
	console.log(
		`\nCoordinates: ${latitude}°N ${longitude}°E`,
		`\nElevation: ${elevation}m asl`,
		`\nTimezone: ${timezone} ${timezoneAbbreviation}`,
		`\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`,
	);
	
	const hourly = response.hourly()!;
	
	// Note: The order of weather variables in the URL query and the indices below need to match!
	const weatherData = {
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
	};
	
	// The 'weatherData' object now contains a simple structure, with arrays of datetimes and weather information
	console.log("\nHourly data:\n", weatherData.hourly)
}