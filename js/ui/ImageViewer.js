/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {
  constructor(element) {
    this.element = element;
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по изображению меняет класс активности у изображения
   * 2. Двойной клик по изображению отображает изображаения в блоке предпросмотра
   * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности?
   * Добавляет или удаляет класс активности у всех изображений
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
   * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
   */

  registerEvents() {
    this.selecteds = this.element.querySelectorAll(".medium")
    this.btnSelectAll = this.element.getElementsByClassName("select-all")[0]
    this.btnSend = this.element.getElementsByClassName("send")[0]

    const countFiles = document.getElementsByClassName("count-files")[0]
    const countFilesSelected = document.getElementsByClassName("count-files-selected")[0]
    const previewOneImage = this.element.getElementsByClassName("column six wide")[0]
    const btnShowUploadedFiles = this.element.getElementsByClassName("show-uploaded-files")[0]

    countFiles.innerHTML = this.selecteds.length
    countFilesSelected.innerHTML = document.querySelectorAll(".selected").length
    
    this.checkButtonText()

    this.selecteds.forEach(selected => {
      selected.onclick = function (event) {
        event.target.classList.toggle("selected")
        const selectedsCount = document.querySelectorAll(".selected")
        countFilesSelected.innerHTML = selectedsCount.length
        App.imageViewer.checkButtonText()
      }
      selected.addEventListener('dblclick', function (event) {
        previewOneImage.innerHTML = ''
        previewOneImage.insertAdjacentHTML("afterBegin", `<img class="ui fluid image" src="${event.target.src}">`)
        App.imageViewer.checkButtonText()
      });
    });

    // Добавлено действие открытия в отдельном окне изображения
    // при клике на области предпросмотра
    previewOneImage.onclick = function (event) {
      window.open(`${event.target.src}`)
    }

    this.btnSelectAll.addEventListener('click', () => {
      if (this.btnSelectAll.innerHTML === 'Снять выделение') {
        this.selecteds.forEach(item => {
          if (item.classList.contains('selected')) {
            item.classList.toggle('selected')
          }
          this.checkButtonText()
          countFilesSelected.innerHTML = document.querySelectorAll(".selected").length
        })
      } else {
        this.selecteds.forEach(item => {
          if (!item.classList.contains('selected')) {
            item.classList.toggle('selected')
          }
          this.checkButtonText()
          countFilesSelected.innerHTML = document.querySelectorAll(".selected").length
        })
      }
    })

    btnShowUploadedFiles.onclick = function () {
      const previewModal = App.getModal("filePreviewer");
      if (!document.querySelector('.uploaded-previewer-modal .content .asterisk')) {
        document.querySelector('.uploaded-previewer-modal .content').innerHTML =
          '<i class="asterisk loading icon massive"></i>';
      }
      previewModal.open();
      Yandex.getUploadedFiles((_, preview) => {
        console.log(preview, ' - preview');
        
        preview._embedded.items.forEach(item => {
          const data = {};
          data.name = item.name
          data.size = parseFloat(item.size / 1024).toFixed(1);
          data.date = item.created;
          data.imageUrl = item.sizes[0].url
          data.pathUrl = preview.path;
          data.downLoaderUrl = item.file;
          PreviewModal.showImages(data)
        });
        previewModal.registerEvents()
        if (document.querySelector('.uploaded-previewer-modal > .scrolling > .image-preview-container') === null) {
          previewModal.close()
        }
      });
    }

    this.btnSend.onclick = function () {
      const sendModal = App.getModal('fileUploader');
      const allSelectedImages = document.querySelectorAll('.selected');
      sendModal.open();
      sendModal.showImages(Array.from(allSelectedImages).map(image => image.src));
    }
  }

  /**
   * Очищает отрисованные изображения
   */
  static clear() {
    const clear = document.getElementById("images")
    clear.innerHTML = '';
  }

  /**
   * Отрисовывает изображения.
  */
  static ImageViewer(images) {
    const insert = document.getElementById("images")
    images.forEach(image => {
      insert.insertAdjacentHTML("afterBegin", `<img class="four wide column ui medium image-wrapper" src="${image}">`)
    });
    App.imageViewer.registerEvents()
  }

  /**
   * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
   */

  checkButtonText() {
    const selectedsCount = document.querySelectorAll(".selected").length

    if (this.selecteds.length > 0) {
      this.btnSelectAll.classList.remove('disabled')
    }

    if (selectedsCount === this.selecteds.length) {
      this.btnSelectAll.innerHTML = 'Снять выделение'
    } else { 
      this.btnSelectAll.innerHTML = 'Выбрать всё' 
    }

    if (selectedsCount > 0 && this.btnSend.classList.contains('disabled')) {
      this.btnSend.classList.toggle('disabled')
    } else if (selectedsCount <= 0 && !this.btnSend.classList.contains('disabled')) {
      this.btnSend.classList.toggle('disabled')
    }

  }
}
