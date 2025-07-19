import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://labmhtrafdslfwqmzgky.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhYm1odHJhZmRzbGZ3cW16Z2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2OTAzNzksImV4cCI6MjA2NTI2NjM3OX0.CviQ3lzngfvqDFwEtDw5cTRSEICWliunXngYCokhbNs'
);

(async () => {
  const params    = new URLSearchParams(location.search);
  const menuKey   = params.get('menu');   // ?menu=3 の「3」を取得
  const container = document.getElementById('reviews');

  if (!menuKey) {
    container.innerHTML = '<p class="not-found">メニューが指定されていません。</p>';
    return;
  }

  const { data: reviews, error } = await supabase
    .from('find_comments')
    .select('nickname, age, gender, comment, created_at')
    .eq('menu_id', menuKey)
    .order('created_at', { ascending: false })
    .range(0, 2);  // 最新 5 件を取得

  if (error) {
    console.error(error);
    container.innerHTML = '<p class="not-found">レビューの取得に失敗しました。</p>';
    return;
  }
  if (!reviews.length) {
    container.innerHTML = '<p class="no-reviews">まだクチコミがありません。</p>';
    return;
  }

  container.innerHTML = reviews.map(r => {
    const date = new Date(r.created_at).toLocaleDateString();
    const nick = r.nickname || '匿名';
    const meta = [r.age, r.gender].filter(Boolean).join(' ') + '・' + date;
    return `
      <div class="review-item">
        <div class="review-header">
          <span class="nick">${nick}</span>
          <span class="meta">${meta}</span>
        </div>
        <div class="body">${r.comment}</div>
      </div>
    `;
  }).join('');
})();
