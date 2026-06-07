document.addEventListener('DOMContentLoaded', function() {
    initAnnouncement();
    initGitHubEnhancement();
    initGeekCommand();
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
    var followerEl = document.querySelector('[data-github-followers]');
    var totalStarsEl = document.querySelector('[data-total-stars]');
    if (!repoStars.length && !followerEl && !totalStarsEl) return;

    Promise.all([
        fetch('https://api.github.com/users/tanxue0118').then(assertOk).then(function(response) { return response.json(); }),
        fetch('https://api.github.com/users/tanxue0118/repos?per_page=100&sort=updated').then(assertOk).then(function(response) { return response.json(); })
    ])
        .then(function(results) {
            var user = results[0];
            var repos = results[1];

            if (followerEl && typeof user.followers === 'number') {
                followerEl.textContent = user.followers;
            }

            if (totalStarsEl) {
                var totalStars = repos.reduce(function(sum, repo) {
                    return sum + repo.stargazers_count;
                }, 0);
                totalStarsEl.textContent = totalStars;
            }

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

function assertOk(response) {
    if (!response.ok) {
        throw new Error('GitHub request failed');
    }
    return response;
}

function initGeekCommand() {
    var button = document.getElementById('geek-command');
    var output = document.getElementById('command-output');
    if (!button || !output) return;

    var lines = [
        'user: tanxue0118 | role: Android / Magisk tinkerer',
        'focus: ProcessKill, charge-turbo, clean system experience',
        'stack: shell + c + css + a little curiosity',
        'note: build small, test often, keep it useful'
    ];
    var index = 0;

    button.addEventListener('click', function() {
        output.textContent = lines[index];
        index = (index + 1) % lines.length;
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
