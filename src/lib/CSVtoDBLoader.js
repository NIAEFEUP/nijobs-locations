import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import csv from 'csv-parser';

import Location, { LocationConstants } from '../model/Location.js';

const { minLength } = LocationConstants.searchTerm;

const createSearchIndexTokens = str => {
	if (str && str.length > minLength) {
		const minGram = minLength;
		const maxGram = str.length;

		const ngrams = str.split(" ").reduce((ngrams, token) => {
			if (token.length > minGram) {
				for (let i = minGram; i <= maxGram && i <= token.length; ++i) {
					ngrams = [...ngrams, token.substr(0, i)];
				}
			} else {
				ngrams = [...ngrams, token];
			}
			return ngrams;
		}, []).join(" ");

		const tokens = str.split(" ").reduce((tokens, token) => {

			if (tokens.length == 0)
				tokens = [`"${token}"`];
			else {
				tokens = [...tokens, `"${tokens[tokens.length - 1].replace(/\"/g, "")} ${token}"`]
			}

			return tokens;
		}, []).join(" ");

		return `${ngrams} ${tokens}`;
	}

	return str;
}

const processData = async (csvFileName) => {

	return await new Promise((resolve) => {

		const results = [];

		const mapping = {
			lng: "longitude",
			lat: "latitude",
			country: "country",
			city: "city",
		};

		fs.createReadStream(csvFileName)
			.pipe(csv({
				mapHeaders: ({ header }) => mapping[header] ?? null
			}))
			.on('data', (data) => {

				if (!data) return

				data.citySearch = createSearchIndexTokens(data.city);
				data.countrySearch = createSearchIndexTokens(data.country);

				results.push(data)
			})
			.on('error', (err) => resolve([null, err]))
			.on('end', () => resolve([results, null]));
	});
}

export const loadCSVDataToDB = async () => {

	await Location.deleteMany({});

	const filePath = '../assets/worldcities.csv'
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename)

	const [results, error] = await processData(path.join(__dirname, filePath));

	if (error) {
		console.err(error);
		return;
	}

	for (const result of results)
		await Location.create(result); // do this to ensure every operation on the database happens after document insertion
};