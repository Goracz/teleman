type FetcherArgs = Omit<RequestInit, 'body'> & { body?: any };

export const fetcher = async <T>(url: string, args: FetcherArgs = {}): Promise<T> => {
    const modifiedArgs = {...args};
    const token = localStorage.getItem('token');
    if (token) {
        modifiedArgs.headers = {
            ...modifiedArgs.headers,
            Authorization: `Bearer ${token}`,
        };
    }
    if (args.body) {
        modifiedArgs.body = JSON.stringify(args.body);
        modifiedArgs.headers = {
            ...modifiedArgs.headers,
            'Content-Type': 'application/json',
        };
    }
    const response = await fetch(url, modifiedArgs);
    return await response.json();
};
