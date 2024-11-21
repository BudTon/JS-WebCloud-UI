/**
 * Класс Yandex
 * Используется для управления облаком.
 * Имеет свойство HOST
 * */
class Yandex {
  static HOST = 'https://cloud-api.yandex.net/v1/disk';

  /**
   * Метод формирования и сохранения токена для Yandex API
   */
  static getToken() {
    return App.savelocalStorage('ayOAuth', 'Введите OAuth пользователя в Yandex')
  }

  /**
   * Метод загрузки файла в облако
   */
  static uploadFile(path, url, callback) {
    createRequest({
      method: 'POST',
      url: `${Yandex.HOST}/resources/upload`,
      data: { path, url },
      headers: {
        "Authorization": `OAuth ${Yandex.getToken()}`,
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      callback,
    });
  }

  /**
   * Метод удаления файла из облака
   */
  static removeFile(path, callback) {
    createRequest({
      method: 'DELETE',
      url: `${Yandex.HOST}/resources/`,
      data: { path },
      headers: {
        "Authorization": `OAuth ${Yandex.getToken()}`,
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      callback,
    });
  }

  /**
   * Метод получения всех загруженных файлов в облаке
   */
  static getUploadedFiles(callback) {
    const loadPath = `/${App.savelocalStorage('pathFolder', 'Введите путь к папке на Ya_диск в виде: nameFolder/')}`
    createRequest({
      method: 'GET',
      url: `${Yandex.HOST}/resources`,
      data: { path: loadPath, limit: 10000, mediaType: "image" }, //, url },
      headers: {
        "Authorization": `OAuth ${Yandex.getToken()}`,
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      callback,
    });
  }

  /**
   * Метод скачивания файлов
   */
  static downloadFileByUrl(url) {
    const link = document.createElement('a');
    link.href = url;
    link.click();
  }
}
