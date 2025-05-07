/**
 * 指定された文字数でテキストを切り詰め、末尾に省略記号を追加します。
 * @param text - 切り詰めるテキスト
 * @param maxLength - 最大文字数
 * @returns 切り詰められたテキスト
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + '...';
  };