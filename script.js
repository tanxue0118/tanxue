// 等待页面加载
window.onload = function() {
    // 隐藏加载动画
    setTimeout(function() {
        document.getElementById('loader').classList.add('hidden');
    }, 1500);

    // 初始化功能
    initSnowEffect();
    initSnowControl();
    initAnnouncement();
    initNavigation();
    initTypingEffect();
    initCountAnimation();
    initProjects();
    initBackToTop();
};

// ===== 雪花效果 =====
var snowflakes = [];
var canvas, ctx;
var snowCount = parseInt(localStorage.getItem('snowCount')) || 50;

function initSnowEffect() {
    canvas = document.getElementById('snow-canvas');
    ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

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
    requestAnimationFrame(animate);
}

// ===== 公告栏 =====
function initAnnouncement() {
    var dateEl = document.getElementById('announcement-date');
    var contentEl = document.getElementById('announcement-content');
    var announcementEl = document.getElementById('announcement');

    fetch('announcement.json')
        .then(function(response) { return response.json(); })
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
    var navLinks = document.querySelectorAll('.nav-link');
    var hamburger = document.getElementById('hamburger');
    var navLinksContainer = document.getElementById('nav-links');
    var logoLink = document.getElementById('logo-link');

    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navLinksContainer.classList.remove('active');
    }

    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var target = this.getAttribute('data-target');
            closeMobileMenu();
            setTimeout(function() {
                showSection(target);
                updateActiveNav(document.querySelector('.nav-link[data-target="' + target + '"]'));
            }, 100);
        });
    });

    logoLink.addEventListener('click', function(e) {
        e.preventDefault();
        closeMobileMenu();
        setTimeout(function() {
            showSection('home');
            updateActiveNav(document.querySelector('[data-target="home"]'));
        }, 100);
    });

    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });

    document.addEventListener('click', function(e) {
        if (!navLinksContainer.contains(e.target) && !hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    });

    document.querySelectorAll('.btn[data-target]').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var target = this.getAttribute('data-target');
            closeMobileMenu();
            setTimeout(function() {
                showSection(target);
                updateActiveNav(document.querySelector('.nav-link[data-target="' + target + '"]'));
            }, 100);
        });
    });
}

function showSection(id) {
    document.querySelectorAll('.section').forEach(function(section) {
        section.classList.remove('active');
    });
    setTimeout(function() {
        document.getElementById(id).classList.add('active');
    }, 50);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateActiveNav(activeLink) {
    document.querySelectorAll('.nav-link').forEach(function(link) {
        link.classList.remove('active');
    });
    if (activeLink) activeLink.classList.add('active');
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
    });
}

// ===== 项目数据 =====
function initProjects() {
    var projects = [
        {
            title: 'ProcessKill',
            icon: 'fas fa-skull-crossbones',
            description: '一个实用的进程管理工具，帮助用户管理和终止进程。',
            tags: ['Tool', 'Process'],
            link: 'https://github.com/tanxue0118/ProcessKill',
            stars: 8
        },
        {
            title: 'Processkill-Donation',
            icon: 'fas fa-hand-holding-heart',
            description: 'ProcessKill 捐赠支持版本，包含更多高级功能。',
            tags: ['Tool', 'Donation'],
            link: 'https://github.com/tanxue0118/Processkill-Donation',
            stars: 0
        },
        {
            title: 'tanxue',
            icon: 'fas fa-globe',
            description: '我的个人博客网站，使用原生 HTML/CSS/JS 构建。',
            tags: ['HTML', 'CSS', 'JavaScript'],
            link: 'https://github.com/tanxue0118/tanxue',
            stars: 0
        }
    ];

    var grid = document.getElementById('projects-grid');
    grid.innerHTML = projects.map(function(p) {
        var starsHtml = p.stars > 0 ? '<span class="project-stars"><i class="fas fa-star"></i> ' + p.stars + '</span>' : '';
        return '<div class="project-card">' +
            '<div class="project-header">' +
                '<div class="project-icon"><i class="' + p.icon + '"></i></div>' +
                '<div class="project-info"><h3>' + p.title + '</h3><span>开源项目 ' + starsHtml + '</span></div>' +
            '</div>' +
            '<div class="project-body">' +
                '<p>' + p.description + '</p>' +
                '<div class="project-tags">' + p.tags.map(function(t) { return '<span class="project-tag">' + t + '</span>'; }).join('') + '</div>' +
                '<a href="' + p.link + '" target="_blank" class="project-link">查看项目 <i class="fas fa-arrow-right"></i></a>' +
            '</div>' +
        '</div>';
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
