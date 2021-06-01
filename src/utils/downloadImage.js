import html2canvas from 'html2canvas';
import saveAs from 'file-saver';

const downloadImage = async ({ node, name = 'snapshot.png', size = { width: 1920, height: 1080 }, backgroundColor = 'transparent', errorMsg = '画布尺寸太大，无法保存为图片!' }) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    if (!(node instanceof SVGElement)) {
      html2canvas(document.querySelector(node), {
        width: size.width || 1920,
        height: size.height || 1080,
        scale: 1.5,
        dpi: 300,
        backgroundColor: backgroundColor,
        logging: false,
        useCORS: true,
        imageTimeout: 15000
      }).then(canvas => {
        if (canvas.width >= 8192 || canvas.height >= 8192) {
          resolve(errorMsg);
          return;
        }
        if (canvas.toBlob) {
          canvas.toBlob(_saveBlob);
        } else if (canvas.msToBlob) {
          const blob = canvas.msToBlob();
          _saveBlob(blob);
        }

        function _saveBlob (blob) {
          let flag = false;
          if (blob === null) {
            flag = true;
          } else {
            saveAs(blob, name);
          }
          resolve(flag ? errorMsg : 'done');
        };
      });
    };
  });
};

export default downloadImage;
