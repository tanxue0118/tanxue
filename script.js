document.addEventListener('DOMContentLoaded', function() {
    initAnnouncement();
    initGitHubEnhancement();
    initBackToTop();
});

function initAnnouncement() {
    var contentEl = document.getElementById('announcement-content');
    if (!contentEl) return;

    fetch('announcement.json')
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Announcement request failed');
            }
            return response.json();
        })
        .then(function(data) {
            contentEl.textContent = data.content || '最近在维护 Android / Magisk 方向项目。';
        })
        .catch(function() {
            contentEl.textContent = '最近在维护 Android / Magisk 方向项目。';
        });
}

function initGitHubEnhancement() {
    var repoStars = document.querySelectorAll('[data-stars-for]');
    if (!repoStars.length) return;

    fetch('https://api.github.com/users/tanxue0118/repos?per_page=100&sort=updated')
        .then(function(response) {
            if (!response.ok) {
                throw new Error('GitHub request failed');
            }
            return response.json();
        })
        .then(function(repos) {
            repoStars.forEach(function(el) {
                var repoName = el.getAttribute('data-stars-for');
                var repo = repos.find(function(item) {
                    return item.name === repoName;
                });
                if (repo) {
                    el.textContent = '★ ' + repo.stargazers_count;
                }
            });
        })
        .catch(function() {
            // Static fallback values in HTML remain visible.
        });
}

function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function() {
        btn.classList.toggle('visible', window.scrollY > 700);
    }, { passive: true });

    btn.addEventListener('click', function() {
        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
}
