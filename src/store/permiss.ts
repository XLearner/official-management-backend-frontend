import { defineStore } from 'pinia';

export const usePermissStore = defineStore('permiss', {
	state: () => {
		const keys = localStorage.getItem('ms_keys');
		return {
			key: keys ? JSON.parse(keys) : <string[]>[],
		};
	},
	actions: {
		handleSet(val: string[]) {
			this.key = val;
			localStorage.setItem('ms_keys', JSON.stringify(val));
		}
	}
});
