document.addEventListener('DOMContentLoaded', function() {
    initSnowEffect();
    initSnowControl();
    initAnnouncement();
    initNavigation();
    initTypingEffect();
    initCountAnimation();
    initProjects();
    initBackToTop();

    window.setTimeout(hideLoader, 350);
});

function hideLoader() {
    var loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('hidden');
    }
}

// ===== 雪花效果 =====
var snowflakes = [];
var canvas, ctx;
var validSections = ['home', 'about', 'projects', 'contact'];
var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var isCompactViewport = window.matchMedia('(max-width: 768px)').matches;
var savedSnowCount = parseInt(localStorage.getItem('snowCount'), 10);
var snowCount = prefersReducedMotion ? 0 : (savedSnowCount || (isCompactViewport ? 24 : 50));
var animationFrameId = null;

function initSnowEffect() {
    canvas = document.getElementById('snow-canvas');
    ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        } else if (!document.hidden && !prefersReducedMotion && animationFrameId === null) {
            animate();
        }
    });

    createSnowflakes(snowCount);
    animate();
}

function createSnowflakes(count) {
    snowflakes = [];
    for (var i = 0; i < count; i++) {
        snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speed: Math.random() * 1 + 0.5,
            wind: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.5 + 0.2
        });
    }
}

function animate() {
    if (prefersReducedMotion || snowCount === 0) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < snowflakes.length; i++) {
        var s = snowflakes[i];
        s.y += s.speed;
        s.x += s.wind + Math.sin(s.y * 0.01) * 0.3;

        if (s.y > canvas.height) {
            s.y = -s.size;
            s.x = Math.random() * canvas.width;
        }
        if (s.x > canvas.width) s.x = 0;
        if (s.x < 0) s.x = canvas.width;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, ' + s.opacity + ')';
        ctx.fill();
    }
    animationFrameId = requestAnimationFrame(animate);
}

// ===== 公告栏 =====
function initAnnouncement() {
    var dateEl = document.getElementById('announcement-date');
    var contentEl = document.getElementById('announcement-content');
    var announcementEl = document.getElementById('announcement');

    fetch('announcement.json')
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Announcement request failed');
            }
            return response.json();
        })
        .then(function(data) {
            dateEl.textContent = data.date || '';
            contentEl.textContent = data.content || '暂无公告';
            if (data.important) {
                announcementEl.classList.add('important');
            }
        })
        .catch(function() {
            contentEl.textContent = '暂无公告';
        });
}

// ===== 导航功能 =====
function initNavigation() {
    var hamburger = document.getElementById('hamburger');
    var navLinksContainer = document.getElementById('nav-links');

    function closeMobileNav() {
        hamburger.classList.remove('active');
        navLinksContainer.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', '打开导航菜单');
        document.body.style.overflow = '';
    }

    function updateActiveNav(target) {
        document.querySelectorAll('.nav-link').forEach(function(link) {
            var isActive = link.getAttribute('data-target') === target;
            link.classList.toggle('active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    window.navigateTo = function(target) {
        if (validSections.indexOf(target) === -1) {
            target = 'home';
        }

        closeMobileNav();
        
        showSection(target);
        updateActiveNav(target);

        if (window.location.hash !== '#' + target) {
            history.pushState(null, '', '#' + target);
        }
    };

    hamburger.addEventListener('click', function() {
        var isActive = this.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
        this.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        this.setAttribute('aria-label', isActive ? '关闭导航菜单' : '打开导航菜单');
        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinksContainer.classList.contains('active')) {
            closeMobileNav();
            hamburger.focus();
        }
    });

    document.querySelectorAll('[data-target]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo(this.getAttribute('data-target'));
        });
    });

    window.addEventListener('hashchange', function() {
        var target = window.location.hash.replace('#', '') || 'home';
        if (validSections.indexOf(target) === -1) {
            target = 'home';
        }
        closeMobileNav();
        showSection(target);
        updateActiveNav(target);
    });

    var initialTarget = window.location.hash.replace('#', '') || 'home';
    if (validSections.indexOf(initialTarget) === -1) {
        initialTarget = 'home';
    }
    showSection(initialTarget);
    updateActiveNav(initialTarget);
}

function showSection(id) {
    if (validSections.indexOf(id) === -1) {
        id = 'home';
    }

    document.querySelectorAll('.section').forEach(function(section) {
        var isActive = section.id === id;
        section.classList.toggle('active', isActive);
        section.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
}

// ===== 打字效果 =====
function initTypingEffect() {
    var el = document.getElementById('typing-text');
    var texts = ['大一学生 💻', '开源爱好者 🌟', 'Magisk 模块开发者 🛠️', '一只做梦的猫 🐱'];
    var index = 0, charIndex = 0, isDeleting = false;

    function type() {
        var text = texts[index];
        if (isDeleting) {
            el.textContent = text.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = text.substring(0, charIndex + 1);
            charIndex++;
        }

        var delay = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === text.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            index = (index + 1) % texts.length;
            delay = 500;
        }

        setTimeout(type, delay);
    }

    setTimeout(type, 1000);
}

// ===== 数字动画 =====
function initCountAnimation() {
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var target = parseInt(entry.target.getAttribute('data-target'));
                var current = 0;
                var timer = setInterval(function() {
                    current += target / 50;
                    if (current >= target) {
                        entry.target.textContent = target + '+';
                        clearInterval(timer);
                    } else {
                        entry.target.textContent = Math.floor(current);
                    }
                }, 30);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(function(num) {
        observer.observe(num);
    });
}

// ===== 雪花数量调节 =====
function initSnowControl() {
    var slider = document.getElementById('snow-count-slider');
    var valueDisplay = document.getElementById('snow-count-value');

    slider.value = snowCount;
    valueDisplay.textContent = snowCount;

    slider.addEventListener('input', function() {
        snowCount = parseInt(this.value);
        valueDisplay.textContent = this.value;
        localStorage.setItem('snowCount', snowCount);
        createSnowflakes(snowCount);

        if (!prefersReducedMotion && animationFrameId === null) {
            animate();
        }
    });
}

// ===== 项目数据 =====
function initProjects() {
    var projects = [
        {
            title: 'ProcessKill',
            icon: '⚙',
            description: '一个Magisk模块，杀死无用进程。',
            tags: ['Magisk', 'Android'],
            link: 'https://github.com/tanxue0118/ProcessKill',
            stars: 9
        },
        {
            title: 'Processkill-Donation',
            icon: '♥',
            description: '一个收费的Magisk模块，让你的后台更清爽，保后台能力增强。',
            tags: ['Magisk', 'Android'],
            link: 'https://github.com/tanxue0118/Processkill-Donation',
            stars: 0
        },
        {
            title: 'charge-turbo',
            icon: '⚡',
            description: '基于诺鸡鸭大佬的充电加速模块而做。',
            tags: ['Magisk', 'C'],
            link: 'https://github.com/tanxue0118/charge-turbo',
            stars: 3
        },
        {
            title: 'Ghost',
            icon: '?',
            description: '一个带有一点点恐怖点填问卷游戏。',
            tags: ['HTML', 'Game'],
            link: 'https://github.com/tanxue0118/Ghost',
            stars: 0
        },
        {
            title: 'andrej-karpathy-skills-CN',
            icon: '文',
            description: 'Andrej Karpathy 技能课程中文翻译。',
            tags: ['Translation', 'AI'],
            link: 'https://github.com/tanxue0118/andrej-karpathy-skills-CN',
            stars: 0
        },
        {
            title: 'xinli-test',
            icon: 'Ψ',
            description: '一个收集了许多心理测试网站。',
            tags: ['JavaScript', 'Web'],
            link: 'https://github.com/tanxue0118/xinli-test',
            stars: 0
        },
        {
            title: 'tanxue',
            icon: '站',
            description: '一个个人博客。',
            tags: ['HTML', 'CSS'],
            link: 'https://github.com/tanxue0118/tanxue',
            stars: 0
        }
    ];

    var grid = document.getElementById('projects-grid');
    grid.innerHTML = projects.map(function(p) {
        var starsHtml = p.stars > 0 ? '<span class="project-stars">★ ' + p.stars + '</span>' : '';
        var featuredClass = p.stars >= 3 ? ' featured' : '';
        return '<article class="project-card' + featuredClass + '">' +
            '<div class="project-header">' +
                '<div class="project-icon" aria-hidden="true"><span class="icon-symbol">' + p.icon + '</span></div>' +
                '<div class="project-info"><h3>' + p.title + '</h3><span>' + (featuredClass ? '主推项目 ' : '开源项目 ') + starsHtml + '</span></div>' +
            '</div>' +
            '<div class="project-body">' +
                '<p>' + p.description + '</p>' +
                '<div class="project-tags">' + p.tags.map(function(t) { return '<span class="project-tag">' + t + '</span>'; }).join('') + '</div>' +
                '<a href="' + p.link + '" target="_blank" rel="noopener noreferrer" class="project-link">查看项目 <span aria-hidden="true">→</span></a>' +
            '</div>' +
        '</article>';
    }).join('');
}

// ===== 回到顶部 =====
function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', function() {
        btn.classList.toggle('visible', window.scrollY > 500);
    });

    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
