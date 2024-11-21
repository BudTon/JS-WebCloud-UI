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

    static lastCallback = {
        callback: (result) => {
            VK.processData(result);
        },
    }

    /**
     * Получает изображения
     * */
    //Чтобы осуществлять кроссдоменные запросы к API, вы можете использовать протокол JSONP. 
    //Для этого необходимо подключать к документу скрипт с адресом запроса в src. 
    //Запрос должен содержать дополнительный параметр callback c именем функции, которая будет вызвана при получении результата.

    static get(id) {
        (() => {
            let url = `https://api.vk.com/method/photos.get?owner_id=${id}&access_token=${VK.ACCESS_TOKEN()}&album_id=profile&v=5.131&photo_sizes=1&callback=VK.lastCallback.callback`;
            const script = document.createElement('script');
            script.src = url;
            document.getElementsByTagName("head")[0].appendChild(script);
        })()
    }

    /**
     * Передаётся в запрос VK API для обработки ответа.
     * Является обработчиком ответа от сервера.
     */
    static processData(result) {
        if (result.error) {
            alert(result.error.error_msg);
            App.imageViewer.registerEvents()
            return;
        }
        if (result.response.items.length == 0) {
            alert("у пользователя нет фото");
            App.imageViewer.registerEvents()
            return;
        }
        if (!result) {
            alert('Ошибка обращения к серверу, введите новый ID');
            App.imageViewer.registerEvents()
            return;
        }
        const elScript = document.querySelector('head').querySelector('script');
        elScript.remove();

        VK.lastCallback.imagesVk = []
        const images = []      
        result.response.items.forEach(element => {
            // Получение свойств максимального размера фото
            //------------------------------------      
            const maxObjectSize = element.sizes.reduce((prev, current) => prev.height > current.height ? prev : current, {});
            const url = maxObjectSize.url;
            //------------------------------------      
            images.push(url)
            VK.lastCallback.imagesVk.push([element.date, url])
        });
        ImageViewer.ImageViewer(images);
    }
}
