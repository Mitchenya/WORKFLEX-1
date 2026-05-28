export function makeRequest(url: string, init?: RequestInit) {
  return new Request(url, init);
}

export function makeContext(id: string) {
  return { params: Promise.resolve({ id }) };
}
