"use strict";

/**
 * Класс FileUploaderModal
 * Используется как всплывающее окно для загрузки изображений
 */
class FileUploaderModal extends BaseModal {
  constructor(element) {
    super(element);
    this.fileUploaderModal = document.querySelector('.file-uploader-modal');
    this.fileUploaderContent = this.fileUploaderModal.getElementsByClassName("scrolling content")[0];
    this.fileUploaderActions = this.fileUploaderModal.querySelector('.actions');

    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
   * 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
   * 4. Клик по кнопке загрузке по контроллерам изображения: 
   * убирает ошибку, если клик был по полю вода
   * отправляет одно изображение, если клик был по кнопке отправки
   */
  registerEvents() {

    const btnSendAll = this.fileUploaderActions.querySelector('.send-all')

    const listBtn = [
      this.fileUploaderModal.querySelector('.icon'),
      this.fileUploaderActions.querySelector('.close')
    ]

    listBtn.forEach(btn => {
      btn.addEventListener('click', () => {
        this.close()
      })
    });

    btnSendAll.addEventListener('click', () => {
      this.sendAllImages();
    })

  }

  /**
   * Отображает все полученные изображения в теле всплывающего окна
   */
  showImages(images) {
    this.fileUploaderContent.innerHTML = ''
    images.forEach(image => {
      this.fileUploaderContent.insertAdjacentHTML("afterBegin", this.getImageHTML(image))
    });
    this.btnAllUpload = this.fileUploaderContent.querySelectorAll('.input > .button')
    this.btnAllUpload.forEach((btnOneUpload) => {
      btnOneUpload.onclick = () => {
        const imageContainer = btnOneUpload.parentElement.parentElement
        this.sendImage(imageContainer)
      }
    })
  }

  /**
   * Формирует HTML разметку с изображением, полем ввода для имени файла и кнопкной загрузки
   */
  getImageHTML(image) {
    return `<div class="image-preview-container">
              <img src="${image}"/>
              <div class="ui action input">
                <input type="text" placeholder="Путь к файлу">
                <button class="ui button"><i class="upload icon"></i></button>
              </div>
           </div>`
  }

  /**
   * Отправляет все изображения в облако
   */
  sendAllImages() {
    const allImagesContainer = document.querySelectorAll('.image-preview-container')
    allImagesContainer.forEach(imageOneContainer => {
      this.sendImage(imageOneContainer)
    });
  }

  /**
   * Валидирует изображение и отправляет его на сервер
   */
  sendImage(imageContainer) {
    const pathFolder = `/${App.savelocalStorage('pathFolder', 'Введите путь к папке на Ya_диск в виде: nameFolder/')}`
    const inputPath = imageContainer.querySelector('input')
    if (inputPath.value.trim() === '') {
      inputPath.parentElement.classList.add('error')
    } else {
      const path = pathFolder + inputPath.value + '.jpg';
      const url = imageContainer.firstElementChild.src;
      Yandex.uploadFile(path, url, () => {
        imageContainer.remove()
        const countImagesPreviewContainer = document.querySelectorAll('.image-preview-container')
        if (countImagesPreviewContainer.length === 0) {
          this.close()
        }
      })
    }
  }
} 
