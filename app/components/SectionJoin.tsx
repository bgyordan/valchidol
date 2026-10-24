// Съединение между две секции с различен фон на началната страница:
// горният фон „прелива“ надолу с плавна вълнообразна линия.
// from — цветът на горната секция (CSS стойност).
export default function SectionJoin({ from, flip = false }: { from: string; flip?: boolean }) {
  return (
    <div className={`sj${flip ? ' flip' : ''}`} aria-hidden="true" style={{ ['--sj-from' as any]: from }}>
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path d="M0 0H1440V38C1260 92 1080 96 900 70C700 40 520 18 320 40C200 54 100 74 0 64Z" />
      </svg>
    </div>
  );
}
