import { ref } from 'vue';

export function useImgBaseUrl() {
    const imgBaseUrl = ref('');

    const extractImgBaseUrl = (res: any) => {
        if (typeof res?.baseUrl === 'string' && res.baseUrl) return res.baseUrl;
        if (res?.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
            if (typeof res.data.baseUrl === 'string' && res.data.baseUrl) return res.data.baseUrl;
        }
        if (Array.isArray(res?.data) && res.data.length > 0) {
            const first = res.data[0];
            if (first && typeof first.baseUrl === 'string' && first.baseUrl) return first.baseUrl;
        }
        return '';
    };

    const getImgUrl = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) return path;
        return imgBaseUrl.value + path;
    };

    return { imgBaseUrl, extractImgBaseUrl, getImgUrl };
}
