/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */
class VK {

  static ACCESS_TOKEN() { 
    return App.savelocalStorage('tokenVK', 'Введите tokenVK от Вашего приложения в VK')
  }
  
  static lastCallback = [];

  /**
   * Получает изображения
   * */
  static get(id = '', callback) {
    const xhr = new XMLHttpRequest()
    xhr.responseType = 'json';
    const urlVK = 'https://api.vk.com/method/';
    const metodVK = 'photos.getAll';
    const paramsVK = 'extended=1&v=5.131&count=200';
    const vkResp = `${urlVK + metodVK}?owner_id=${id}&${paramsVK}&access_token=${VK.ACCESS_TOKEN()}`
    xhr.addEventListener('readystatechange', (e) => {
      e.preventDefault();
      try {
        if (xhr.readyState === xhr.DONE) {
          const result = xhr.response.response.items;
          VK.processData(result)
        }
      } catch (error) {
        alert('Ошибка обращения к серверу введите новый ID')
        App.imageViewer.registerEvents()
      }
    })
    xhr.open('GET', vkResp);
    xhr.send();
  }

  /**
   * Передаётся в запрос VK API для обработки ответа.
   * Является обработчиком ответа от сервера.
   */
  static processData(result) {
    VK.lastCallback = []
    const images = []
    result.forEach(element => {

      // Получение свойств максимального размера фото
      //------------------------------------      
      const maxObjectSize = element.sizes.reduce((prev, current) => prev.height > current.height ? prev : current, {});
      const url = maxObjectSize.url;
      //------------------------------------      
      images.push(url)
      VK.lastCallback.push([element.date, url])
    });
    ImageViewer.ImageViewer(images);
  }
}
