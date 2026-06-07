document.addEventListener('DOMContentLoaded', function() {
    initAnnouncement();
    initGitHubEnhancement();
    initGeekCommand();
    initNavigationPolish();
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
    var brandMark = document.getElementById('brand-mark');
    if (!button || !output) return;

    var sessions = [
        {
            command: './whoami',
            lines: [
                'user: tanxue0118',
                'role: Android / Magisk tinkerer',
                'focus: ProcessKill + charge-turbo'
            ]
        },
        {
            command: './stack --short',
            lines: [
                'shell, c, css, javascript',
                'target: cleaner Android system experience',
                'mode: small tools, useful defaults'
            ]
        },
        {
            command: './cat dream.log',
            lines: [
                '一只做梦的猫正在编译下一个点子',
                'warning: curiosity level is still high',
                'status: shipped tiny geek detail'
            ]
        }
    ];
    var index = 0;

    function runCommand() {
        var session = sessions[index];
        output.classList.remove('is-active');
        void output.offsetWidth;
        output.classList.add('is-active');
        button.classList.add('is-running');
        button.textContent = session.command;
        output.innerHTML = '<span class="prompt">guest@tanxue</span>' +
            '<span class="command-text">' + escapeHtml(session.command) + '</span>' +
            session.lines.map(function(line, lineIndex) {
                var className = lineIndex === 0 ? 'command-line' : 'command-line dim';
                return '<span class="' + className + '">' + escapeHtml(line) + '</span>';
            }).join('');
        index = (index + 1) % sessions.length;

        window.setTimeout(function() {
            button.classList.remove('is-running');
        }, 700);
    }

    button.addEventListener('click', runCommand);
    if (brandMark) {
        brandMark.addEventListener('dblclick', runCommand);
    }
}

function escapeHtml(value) {
    return value.replace(/[&<>"']/g, function(char) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[char];
    });
}

function initNavigationPolish() {
    var progress = document.getElementById('scroll-progress');
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('[data-nav-target]'));
    var sections = navLinks.map(function(link) {
        return document.getElementById(link.getAttribute('data-nav-target'));
    }).filter(Boolean);

    function updateProgress() {
        if (!progress) return;
        var scrollable = document.documentElement.scrollHeight - window.innerHeight;
        var ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
        progress.style.transform = 'scaleX(' + Math.max(0, Math.min(1, ratio)) + ')';
    }

    function updateActiveNav() {
        if (!sections.length) return;
        var current = sections[0].id;
        sections.forEach(function(section) {
            if (section.getBoundingClientRect().top <= 120) {
                current = section.id;
            }
        });
        navLinks.forEach(function(link) {
            var active = link.getAttribute('data-nav-target') === current;
            link.classList.toggle('is-active', active);
            if (active) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    window.addEventListener('scroll', function() {
        updateProgress();
        updateActiveNav();
    }, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
    updateActiveNav();
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
