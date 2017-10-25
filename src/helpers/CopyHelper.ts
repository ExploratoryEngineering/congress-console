export class CopyHelper {
  copyToClipBoard(copyText): Promise<any> {
    return new Promise((res, rej) => {
      let textArea = document.createElement('textarea');

      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';

      document.body.appendChild(textArea);

      textArea.value = copyText;
      textArea.select();

      let error;

      try {
        document.execCommand('copy');
      } catch (copyError) {
        error = copyError;
      }

      document.body.removeChild(textArea);

      if (error) {
        rej(error);
      } else {
        res();
      }
    });
  }
}
