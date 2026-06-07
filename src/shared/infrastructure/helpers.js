export function extractArrayData(response, expectedKey) {
  if (!response) return []
  if (Array.isArray(response)) return response
  if (response.data && Array.isArray(response.data)) return response.data
  if (expectedKey && response[expectedKey] && Array.isArray(response[expectedKey])) return response[expectedKey]
  if (typeof response === 'object' && !Array.isArray(response)) return [response]
  return []
}
