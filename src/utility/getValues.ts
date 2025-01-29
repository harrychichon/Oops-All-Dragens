import { endpoints } from "../api/api";
import { baseUrl } from "../api/api";
import { fetchApi } from "../api/fetchFunctions";

// Function to fetch data from a given endpoint URL
const fetchEndpointData = async (endpointUrl: string) => {
  const url = `${baseUrl}${endpointUrl}`;
  return await fetchApi(url);
};
n;

// Function to fetch item data from a result URL
const fetchItemData = async (resultUrl: string) => {
  const itemUrl = resultUrl.startsWith("/api/")
    ? `${baseUrl}${resultUrl.slice(4)}`
    : `${baseUrl}${resultUrl}`;
  return await fetchApi(itemUrl);
};

// Function to collect key-value pairs from item data
const collectKeyValuePairs = (
  itemData: Record<string, any>,
  keyValueMap: Record<string, Set<string>>
) => {
  for (const [key, value] of Object.entries(itemData)) {
    if (!keyValueMap[key]) {
      keyValueMap[key] = new Set();
    }

    if (typeof value === "string" || typeof value === "number") {
      keyValueMap[key].add(String(value));
    } else if (Array.isArray(value)) {
      value.forEach((item) =>
        keyValueMap[key].add(
          typeof item === "object" ? JSON.stringify(item) : String(item)
        )
      );
    } else if (typeof value === "object" && value !== null) {
      keyValueMap[key].add(JSON.stringify(value));
    }
  }
};

// Function to log aggregated data
const logAggregatedData = (
  keyValueMap: Record<string, Set<string>>,
  selectedEndpoint: string
) => {
  console.log(`\n  Aggregated data from ${selectedEndpoint}:`);
  for (const [key, valueSet] of Object.entries(keyValueMap)) {
    console.log(`    ${key} values: ${Array.from(valueSet).join(", ")}`);
  }
};

// Main function to fetch and log endpoint data
export const fetchAndLogEndpointData = async (
  selectedEndpoint: keyof typeof endpoints
) => {
  const endpointUrl = endpoints[selectedEndpoint];
  console.log(`\nFetching data for endpoint: ${selectedEndpoint}`);

  try {
    const data = await fetchEndpointData(endpointUrl);

    if (
      typeof data === "object" &&
      data !== null &&
      "results" in data &&
      Array.isArray(data.results)
    ) {
      console.log(`  Data from ${selectedEndpoint} endpoint:`);
      console.log(`    count: ${data.count}`);

      const keyValueMap: Record<string, Set<string>> = {};

      for (const result of data.results) {
        if (result.url) {
          const itemData = await fetchItemData(result.url);
          collectKeyValuePairs(itemData, keyValueMap);
        }
      }

      logAggregatedData(keyValueMap, selectedEndpoint);
    } else {
      console.log(
        `  Response data from ${selectedEndpoint} is not in expected format:`,
        data
      );
    }
  } catch (error) {
    console.error(
      `Error fetching data for endpoint ${selectedEndpoint}:`,
      error
    );
  }
};
