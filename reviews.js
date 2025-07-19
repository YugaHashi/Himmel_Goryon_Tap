import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://labmhtrafdslfwqmzgky.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhYm1odHJhZmRzbGZ3cW16Z2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2OTAzNzksImV4cCI6MjA2NTI2NjM3OX0.CviQ3lzngfvqDFwEtDw5cTRSEICWliunXngYCokhbNs'
);

async function loadReviews() {
  const container = document.getElementById('reviews');
  const menuName  = container.dataset.menu;  // Carrd で渡される日本語メニュー名

  if (!menuName) {
    container.insertAdjacentHTML('beforeend',
      '<p class="not-found">メニュー名が指定されていません。</p>'
    );
    return;
  }

  const { data: reviews, error } = await supabase
    .from('find_comments_public')       // または find_comments
    .select('nickname, age, gender, comment, created_at')
    .eq('menu_name_jp', menuName)       // 日本語メニュー名でフィルタ
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    container.insertAdjacentHTML('beforeend',
      '<p class="not-found">クチコミ取得に失敗しました。</p>'
    );
    return;
  }
  if (!reviews || reviews.length === 0) {
    container.insertAdjacentHTML('beforeend',
      '<p class="no-reviews">まだクチコミがありません。</p>'
    );
    return;
  }

  reviews.forEach(r => {
    const date = new Date(r.created_at).toLocaleDateString();
    const nick = r.nickname || '匿名';
    const meta = [r.age, r.gender].filter(Boolean).join(' ') + '・' + date;
    const html = `
      <div class="review-item">
        <div class="review-header">
          <span class="nick">${nick}</span>
          <span class="meta">${meta}</span>
        </div>
        <div class="body">${r.comment}</div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
  });
}

window.addEventListener('DOMContentLoaded', loadReviews);
