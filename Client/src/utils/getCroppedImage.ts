export const getCroppedImg = (
    imageSrc: string,
    pixelCrop: { width: number; height: number; x: number; y: number } | null,
    fileName: string
  ): Promise<File> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx || !pixelCrop) {
          return reject(new Error('Unable to create canvas context or invalid crop area'));
        }

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          const file = new File([blob], fileName, { type: 'image/jpeg' });
          resolve(file);
        }, 'image/jpeg');
      };
      image.onerror = (error) => reject(error);
    });
  };