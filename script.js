document.addEventListener("DOMContentLoaded", function() {
    
    // 카카오맵 API
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

    // 갤러리 모달 기능
    const modal = document.getElementById("modal");
    if (modal) {
        const modalImg = document.getElementById("modal-img");
        const galleryItems = document.querySelectorAll(".gallery-item");
        const closeModal = document.querySelector(".close-btn");

        galleryItems.forEach(item => {
            item.addEventListener("click", function() {
                modal.style.display = "flex";
                modalImg.src = this.src;
            });
        });

        closeModal.onclick = function() {
            modal.style.display = "none";
        }
        
        modal.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        }
    }

    // 계좌번호 토글 기능
    const accountBtns = document.querySelectorAll(".account-btn");
    accountBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            const targetId = this.dataset.target;
            const targetDiv = document.getElementById(targetId);
            const isVisible = targetDiv.style.display === "block";
            targetDiv.style.display = isVisible ? "none" : "block";
        });
    });

    // 클립보드 복사 기능
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

    // [수정/복원] 전세버스 인원 입력칸 보이기/숨기기 기능
    document.querySelectorAll('input[name="bus_choice"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const countWrapper = document.getElementById('bus-count-wrapper');
            if (this.value === '해당 없음') {
                countWrapper.classList.add('hidden');
            } else {
                countWrapper.classList.remove('hidden');
                const busGuestsInput = document.getElementById('bus-guests');
                // 인원수 입력칸이 비어있거나 0일 경우, 1로 자동 설정
                if (!busGuestsInput.value || parseInt(busGuestsInput.value) === 0) {
                    busGuestsInput.value = "1";
                }
            }
        });
    });
});