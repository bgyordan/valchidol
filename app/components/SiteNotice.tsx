import { getSiteInfo, noticeActive } from '../../lib/siteinfo';
import NoticeNote from './NoticeNote';

// Обява от ЕИС → Сайт → Настройки (текст, връзка, срок „до“).
// Показва се като листче от тетрадка, което изскача веднъж; после остава листче-иконка в менюто.
export default async function SiteNotice() {
  const { notice } = await getSiteInfo();
  if (!noticeActive(notice)) return null;
  const text = notice.text.trim();
  const link = notice.link.trim();
  // отпечатък на обявата — при нов текст/връзка/срок се показва отново на всички
  const key = `${text}|${link}|${notice.until}`;
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return <NoticeNote id={h.toString(36)} text={text} link={link} />;
}
