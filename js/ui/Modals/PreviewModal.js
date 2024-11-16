/**
 * Класс PreviewModal
 * Используется как обозреватель загруженный файлов в облако
 */
class PreviewModal extends BaseModal {
  constructor(element) {
    super(element);
    this.filePreviewerModal = document.querySelector('.uploaded-previewer-modal');
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по контроллерам изображения: 
   * Отправляет запрос на удаление изображения, если клик был на кнопке delete
   * Скачивает изображение, если клик был на кнопке download
   */
  registerEvents() {
    const btnDeleteList = this.filePreviewerModal.querySelectorAll('.delete')
    const btnDownloadList = this.filePreviewerModal.querySelectorAll('.button.download')
    const btnDeleteAll = this.filePreviewerModal.querySelectorAll('.delete-all')[0]
    const btnDownloadAll = this.filePreviewerModal.querySelectorAll('.download-all')[0]

    const listBtnClose = [
      this.filePreviewerModal.querySelector('.icon'),
      this.filePreviewerModal.querySelector('.close')
    ]

    listBtnClose.forEach(btn => {
      btn.addEventListener('click', () => {
        this.close()
      })
    })


    btnDeleteList.forEach(btn => {
      btn.addEventListener('click', (event) => {
        event.target.querySelector('i').classList.add('spinner', 'loading')
        event.target.classList.add('disabled')
        const path = event.target.dataset.path
        Yandex.removeFile(path, preview => {
          if (preview === null) {
            btn.parentElement.parentElement.remove()
          }
        })
        if (this.filePreviewerModal.querySelectorAll('.delete').length === 1) {
          this.close()
        }
      });
    })


    btnDownloadList.forEach(btn => {
      btn.addEventListener('click', (event) => {
        event.target.querySelector('i').classList.add('spinner', 'loading')
        event.target.classList.add('disabled')
        const path = event.target.dataset.file
        Yandex.downloadFileByUrl(path);
        event.target.querySelector('i').classList.remove('spinner', 'loading')
      });
    })

    btnDeleteAll.addEventListener('click', () => {
      btnDeleteList.forEach(btn => {
        btn.querySelector('i').classList.add('spinner', 'loading')
        btn.classList.add('disabled')
        const path = btn.dataset.path
        Yandex.removeFile(path, preview => {
          if (preview === null) {
            btn.parentElement.parentElement.remove()
          }
        })
      })
      if (btnDeleteList.length === 0) {
        this.close()
      }
    })

    btnDownloadAll.addEventListener('click', () => {
      btnDownloadList.forEach(btn => {
        btn.querySelector('i').classList.add('spinner', 'loading')
        btn.classList.add('disabled')
        const path = btn.dataset.file
        Yandex.downloadFileByUrl(path);
        btn.querySelector('i').classList.remove('spinner', 'loading')
      });
    })


  }

  /**
   * Отрисовывает изображения в блоке всплывающего окна
   */
  static showImages(data) {
    data.date = PreviewModal.formatDate(data.date)
    const filePreviewerContent = document.querySelector('.uploaded-previewer-modal > .scrolling');
    filePreviewerContent.insertAdjacentHTML("afterBegin", PreviewModal.getImageInfo(data))
    const asteriskLoadingIcon = filePreviewerContent.querySelector('.asterisk')
    if (asteriskLoadingIcon !== null) {
      asteriskLoadingIcon.remove()
    }
  }

  /**
   * Форматирует дату в формате 2021-12-30T20:40:02+00:00(строка)
   * в формат «30 декабря 2021 г. в 23:40» (учитывая временной пояс)
   * */
  static formatDate(date) {
    let dateImage = new Date(date);
    let formatter = new Intl.DateTimeFormat("ru-RU", {
      // weekday: "long", 
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
    return formatter.format(dateImage)
  }

  /**
   * Возвращает разметку из изображения, таблицы с описанием данных изображения и кнопок контроллеров (удаления и скачивания)
   */
  static getImageInfo(item) {
    const containerImage = `<div class="image-preview-container">
      <img src='${item.imageUrl}' />
      <table class="ui celled table">
        <thead>
          <tr><th>Имя</th><th>Создано</th><th>Размер</th></tr>
        </thead>
        <tbody>
          <tr><td>${item.name}</td><td>${item.date}</td><td>${item.size}Кб</td></tr>
        </tbody>
      </table>
      <div class="buttons-wrapper">
        <button class="ui labeled icon red basic button delete" data-path='${item.pathUrl}/${item.name}'>
          Удалить
          <i class="trash icon"></i>
        </button>
        <button class="ui labeled icon violet basic button download" data-file='${item.downLoaderUrl}'>
          Скачать
          <i class="download icon"></i>
        </button>
      </div>
    </div>`
    return containerImage
  }
}
