// قائمة السور
const surahs = [
    { number: 1, name: "الفاتحة", verses: 7 },
    { number: 2, name: "البقرة", verses: 286 },
    // ... أضف باقي السور
];

// دالة لإنشاء بطاقات السور
function createSurahCards() {
    const container = document.getElementById('surahsContainer');
    surahs.forEach(surah => {
        const card = `
            <div class="surah-card">
                <div class="surah-header">
                    <div class="surah-number">${surah.number}</div>
                    <div class="surah-name">${surah.name}</div>
                </div>
                <div class="surah-actions">
                    <button onclick="readSurah(${surah.number})" class="btn">
                        <i class="fas fa-book-open"></i> قراءة
                    </button>
                    <button onclick="playSurah(${surah.number})" class="btn">
                        <i class="fas fa-play"></i> استماع
                    </button>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// دالة لقراءة السورة
async function readSurah(surahNumber) {
    const modal = document.getElementById('readModal');
    const modalContent = document.getElementById('modalContent');
    
    // عرض شاشة التحميل
    modalContent.innerHTML = '<div class="loader"></div>';
    modal.style.display = 'block';

    try {
        // جلب آيات السورة
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
        const data = await response.json();
        const verses = data.data.ayahs;

        // عرض الآيات
        let html = `
            <div class="surah-title">${data.data.name}</div>
            <div class="verses-container">
        `;

        verses.forEach(verse => {
            html += `
                <div class="verse">
                    <span class="verse-number">${verse.numberInSurah}</span>
                    <span class="verse-text">${verse.text}</span>
                    <button onclick="playVerse(${surahNumber}, ${verse.numberInSurah})" class="verse-play">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            `;
        });

        html += '</div>';
        modalContent.innerHTML = html;

    } catch (error) {
        modalContent.innerHTML = '<div class="error">حدث خطأ في تحميل السورة</div>';
    }
}

// دالة لتشغيل السورة كاملة
async function playSurah(surahNumber) {
    const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${surahNumber}.mp3`;
    const audio = new Audio(audioUrl);
    audio.play();
}

// دالة لتشغيل آية محددة
async function playVerse(surahNumber, verseNumber) {
    const audioUrl = `https://cdn.islamic.network/quran/audio/ayah/ar.alafasy/${surahNumber}${verseNumber}.mp3`;
    const audio = new Audio(audioUrl);
    audio.play();
}

// CSS الأساسي
const styles = `
    .surah-card {
        background: white;
        border-radius: 10px;
        padding: 15px;
        margin: 10px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .verse {
        padding: 10px;
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
    }

    .verse-number {
        background: #f0f0f0;
        padding: 5px 10px;
        border-radius: 50%;
        margin-left: 10px;
    }

    .verse-text {
        flex: 1;
        font-size: 18px;
        line-height: 1.8;
    }

    .verse-play {
        background: none;
        border: none;
        cursor: pointer;
        color: #4CAF50;
    }

    .loader {
        /* إضافة أنماط للتحميل */
    }
`;

// إضافة style للصفحة
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', createSurahCards);
