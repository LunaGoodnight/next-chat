export const allImagesLoaded = async (container: HTMLElement): Promise<void[]> => {
    // Select all image elements within the container
    const images = container.querySelectorAll<HTMLImageElement>('img');

    const loadImage = (img: HTMLImageElement, retries = 3): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            const attemptLoad = (retryCount: number) => {
                if (img.complete && img.naturalHeight !== 0) {
                    resolve();
                } else {
                    img.onload = () => resolve();
                    img.onerror = () => {
                        if (retryCount > 0) {
                            console.warn(
                                `Retrying to load image: ${img.src}, attempts left: ${retryCount}`,
                            );
                            setTimeout(() => attemptLoad(retryCount - 1), 1000); // Retry after 1 second
                        } else {
                            console.error(`Failed to load image after retries: ${img.src}`);
                            resolve(); // Resolve even if loading failed
                        }
                    };
                }
            };

            attemptLoad(retries);
        });
    };

    const promises = Array.from(images).map((img) => loadImage(img));

    return Promise.allSettled(promises).then((results) => {
        const rejected = results.filter((result) => result.status === 'rejected');
        if (rejected.length > 0) {
            console.error(`${rejected.length} images failed to load.`);
            rejected.forEach((result, index) =>
                console.error(`Image ${index + 1}:`, (result as PromiseRejectedResult).reason),
            );
        }
        return results.map((result) => {
            if (result.status === 'fulfilled') {
                return result.value;
            } else {
                return undefined;
            }
        }) as void[];
    });
};
