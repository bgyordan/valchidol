import { notFound } from 'next/navigation';
import ShareButton from './ShareButton';
import ArticleMedia from './ArticleMedia';
import { getArticle, getNews, fmtDate } from '../../../lib/data';
import { RichText } from '../../../lib/rich';
import '../novini.css';
import './article.css';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getArticle(slug);
  if (!post) return { title: 'Статията не е намерена — СУ „Васил Левски“ – Вълчи дол' };
  return {
    title: `${post.title} — СУ „Васил Левски“ – Вълчи дол`,
    alternates: { canonical: `/novini/${post.slug}` },
    description: post.excerpt ?? undefined,
    openGraph: { title: post.title, description: post.excerpt ?? undefined, images: post.cover_url ? [post.cover_url] : undefined },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getArticle(slug);
  if (!post) notFound();

  const more = (await getNews(4)).filter((n) => n.id !== post.id).slice(0, 3);

  return (
    <article className="article">
      <header className="article-hero">
        <div className="wrap">
          <nav className="ph-crumb" aria-label="Пътечка">
            <a href="/">Начало</a><span aria-hidden="true">/</span><a href="/novini">Новини</a>
          </nav>
          <h1>{post.title}</h1>
          <p className="article-meta">
            <span className="tag">{post.category}</span>
            <time>{fmtDate(post.published_at)}</time>
            {post.author_name && <span>{post.author_name}</span>}
          </p>
        </div>
      </header>

      <ArticleMedia title={post.title} cover={post.cover_url} gallery={post.gallery_images} after={<ShareButton title={post.title} />}>
        <div className="article-body">
          {post.excerpt && <p className="article-lead">{post.excerpt}</p>}
          <RichText text={post.content} />
        </div>
      </ArticleMedia>

      {more.length > 0 && (
        <section className="section tint">
          <div className="wrap">
            <div className="sec-head"><h2>Още новини</h2><a className="more" href="/novini">Всички новини</a></div>
            <div className="nl-grid">
              {more.map((n) => (
                <a key={n.id} className="nl-item" href={`/novini/${n.slug}`}>
                  <div className="nl-img">{n.cover_url ? <img src={n.cover_url} alt="" loading="lazy" /> : <span className="nl-noimg" />}</div>
                  <p className="nl-meta"><time>{fmtDate(n.published_at)}</time></p>
                  <h3>{n.title}</h3>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
