export const limitTitleToLetters = (title: string, maxLetters: number): string => {
	if (title.length > maxLetters) {
		return title.slice(0, maxLetters) + '...';
	}
	return title;
};
