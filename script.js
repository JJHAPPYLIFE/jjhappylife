/**
 * 화면 하단에 팝업(토스트) 메시지를 보여주는 함수
 * @param {string} message - 표시할 메시지
 * @param {boolean} isError - 오류 메시지인지 여부 (기본값: false)
 */
function showToast(message, isError = false) {
    const toast = document.getElementById("submit-toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove('error'); // 이전 에러 스타일 제거

    if (isError) {
        toast.classList.add('error');
    }

    toast.classList.add("show"); // 팝업 보이기

    // 3초 후에 팝업을 자동으로 사라지게 함
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


// [수정] 모든 코드가 이 DOMContentLoaded 이벤트 리스너 안에서 실행되도록 구조 변경
document.addEventListener("DOMContentLoaded", function() {
    
    // 카카오맵 API (기존과 동일)
    const mapContainer = document.getElementById('map');
    if (mapContainer && typeof kakao !== "undefined") {
        const mapOption = { 
            center: new kakao.maps.LatLng(37.58386, 127.05876), // 서울시립대 위도, 경도
            level: 4 
        };
        const map = new kakao.maps.Map(mapContainer, mapOption);
        const markerPosition = new kakao.maps.LatLng(37.58386, 127.05876);
        const marker = new kakao.maps.Marker({ 
            position: markerPosition 
        });
        marker.setMap(map);
    }

    // 계좌번호 토글 기능 (기존과 동일)
    const accountBtns = document.querySelectorAll(".account-btn");
    accountBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            const targetId = this.dataset.target;
            const targetDiv = document.getElementById(targetId);
            const isVisible = targetDiv.style.display === "block";
            targetDiv.style.display = isVisible ? "none" : "block";
        });
    });

    // 클립보드 복사 기능 (기존과 동일)
    if (typeof ClipboardJS !== "undefined") {
        const clipboard = new ClipboardJS('.copy-btn');
        clipboard.on('success', function(e) {
            alert("계좌번호가 복사되었습니다.");
            e.clearSelection();
        });
        clipboard.on('error', function(e) {
            alert("복사에 실패했습니다.");
        });
    }

    // 전세버스 인원 입력칸 보이기/숨기기 기능 (기존과 동일)
    document.querySelectorAll('input[name="bus_choice"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const countWrapper = document.getElementById('bus-count-wrapper');
            if (this.value === '해당 없음') {
                countWrapper.classList.add('hidden');
            } else {
                countWrapper.classList.remove('hidden');
                const busGuestsInput = document.getElementById('bus-guests');
                if (!busGuestsInput.value || parseInt(busGuestsInput.value) === 0) {
                    busGuestsInput.value = "1";
                }
            }
        });
    });

    // 참석 의사(RSVP) 폼 제출 처리 로직 (기존과 동일)
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            
            const form = event.target;
            const formData = new FormData(form);
            const submitButton = form.querySelector('button[type="submit"]');

            submitButton.disabled = true;
            submitButton.textContent = '전송 중...';

            fetch(form.action, {
                method: form.method,
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    showToast("참석 의사를 전달해주셔서 감사합니다!");
                    form.reset();
                    document.getElementById('bus-count-wrapper').classList.add('hidden');
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            showToast(data["errors"].map(error => error["message"]).join(", "), true);
                        } else {
                            showToast("전송에 실패했습니다. 다시 시도해주세요.", true);
                        }
                    })
                }
            }).catch(error => {
                showToast("네트워크 오류가 발생했습니다. 다시 시도해주세요.", true);
            }).finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = '참석 의사 보내기';
            });
        });
    }

    // =================================================================
    // =========== [위치 이동] 스크롤 애니메이션 처리 로직 ===============
    // =================================================================
    const animationTargets = document.querySelectorAll('.scroll-animate');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animationTargets.forEach(target => {
        observer.observe(target);
    });

    const galleryGrid = document.querySelector('.gallery-custom-grid');

    if (galleryGrid) {
        const galleryObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const items = entry.target.querySelectorAll('.gallery-item');
                    items.forEach((item, index) => {
                        // 각 아이템에 순차적인 딜레이를 적용
                        item.style.transitionDelay = `${index * 80}ms`; // 80ms 간격으로 나타남
                        item.classList.add('visible');
                    });
                    observer.unobserve(entry.target); // 갤러리 전체에 대해 한 번만 실행
                }
            });
        }, {
            threshold: 0.1 // 갤러리가 10% 보이면 실행
        });
    
        galleryObserver.observe(galleryGrid);
    }

});