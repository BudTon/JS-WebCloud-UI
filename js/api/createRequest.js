/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    const url = new URL(options.url);

    try {
        Object.entries(options.data).forEach(([key, val]) => {
            url.searchParams.append(key, val);
        });
        
        xhr.responseType = 'json';
        xhr.open(options.method, url.toString(), true);

        if (options.headers) {
            Object.entries(options.headers).forEach(([key, val]) => {
                xhr.setRequestHeader(key, val);
            });
        }
        
        xhr.send();
        xhr.onload = () => {
            options.callback(null, xhr.response);
        };
    } catch (error) {
        console.error('Ошибка при выполнении запроса: ', error);
        options.callback(error);
    }

};
