var collectionSwiper = new Swiper('.research-collection-area .swiper-container', {
    slidesPerView: 'auto',
    spaceBetween: 10,
});
var colElements = new Array();

function createResearchContent() {
    var researchContentWrapper = document.getElementById("researchList");
    var gridElements = "";
    var gridLength = 5;
    var colLength = 23;
    var idx;

    if (researchContentWrapper.childElementCount === 0) {
        for (var i = 1; i <= gridLength; i++) {
            gridElements += `
            <li class="grid-con">
                <div class="grid-inner">
                    <ul class="list-wrap">
                    </ul>
                </div>
            </li>
            `;
        }
        researchContentWrapper.innerHTML = gridElements;
    }

    for (var j = 0; j < gridLength; j++) {
        colElements.push("");
        for (var k = 1; k <= colLength; k++) {
            var randomImageNumber = Math.floor(Math.random() * colLength) + 1;
            colElements[j] += `
            <li class="list-con">
                <div class="list-inner">
                    <button class="thumbnail">
                        <img src="assets/images/example${randomImageNumber}.jpg" alt="thumbnail">
                    </button>
                </div>
            </li>`
        }
        researchContentWrapper.children[j].querySelector('.list-wrap').innerHTML = colElements[j];
    }
}

createResearchContent();

function addToListItems() {
    var scrollTop = window.scrollY;
    var itemWrappers = document.querySelectorAll('#researchList .grid-con');
    var wrapperMinHeight = itemWrappers[0].clientHeight;
    var screenHeight = screen.height;
    for (var i = 0; i < itemWrappers.length; i++) {
        if (itemWrappers[i].clientHeight < wrapperMinHeight && itemWrappers[i].clientHeight !== 0) {
            wrapperMinHeight = itemWrappers[i].clientHeight;
        }
    }
    var addPointSum = wrapperMinHeight - screenHeight;

    if (addPointSum < scrollTop + screenHeight) {
        createResearchContent();
        researchContentClickEvent();
    }
}

window.onscroll = function () {
    addToListItems();
}

function researchContentClickEvent() {
    var thumbnailClass = ".research-list-area .list-grid-area .thumbnail";
    var thumbnails = document.querySelectorAll(thumbnailClass);
    thumbnails.forEach(function (thumbnail, idx) {
        thumbnail.addEventListener("click", function () {
            var thumbnailImage = thumbnail.querySelector('img');
            var thumbnailWidth = thumbnailImage.width;
            var thumbnailHeight = thumbnailImage.height;
            var thumbnailSrc = thumbnailImage.src;
            var collectionSlideWrapper = document.querySelector('.research-collection-area');
            var collectionThumbnailHieght = collectionSlideWrapper.clientHeight;
            var thumbnailRatio = collectionThumbnailHieght / thumbnailHeight;
            var thumbnailTransitionWidth = Math.floor(thumbnailWidth * thumbnailRatio);
            var thumbnailContainer = thumbnail.closest('.list-con');
            var thumbnailInner = thumbnail.closest('.list-inner');

            thumbnailContainer.classList.add('selected');

            function thumbnailFixedPosition() {
                var thumbnailDomRect = thumbnail.getBoundingClientRect();
                var thumbnailTop = thumbnailDomRect.top - window.scrollY;
                var thumbnailLeft = thumbnailDomRect.left - window.scrollX;
                thumbnailInner.style.top = thumbnailTop + 'px';
                thumbnailInner.style.left = thumbnailLeft + 'px';
                thumbnailInner.style.width = thumbnailContainer.clientWidth + 'px';
                setTimeout(() => {
                    thumbnailMoving();
                }, 0);
            }

            function collectionSlideMoving() {
                var collectionThumbnailMarginRight = parseInt(collectionSlideWrapper.querySelector('.swiper-slide').style.marginRight.replace("px", ""));
                var collectionThumbnailWidthSum = thumbnailTransitionWidth + collectionThumbnailMarginRight;
                collectionSlideWrapper.style.paddingLeft = collectionThumbnailWidthSum + 'px';
                collectionSlideWrapper.classList.add('active');
            }

            function thumbnailMoving() {
                var collectionDomRect = collectionSlideWrapper.getBoundingClientRect();
                var collectionTop = collectionDomRect.top;
                var collectionLeft = collectionDomRect.left;
                thumbnailInner.style.top = collectionTop + 'px';
                thumbnailInner.style.left = collectionLeft + 'px';
                thumbnailInner.style.width = thumbnailTransitionWidth + 'px';
                setTimeout(() => {
                    addToCollectionSlide();
                }, 500);
            }

            function addToCollectionSlide() {
                thumbnailContainer.remove();
                collectionSlideWrapper.style.paddingLeft = '0px';
                collectionSlideWrapper.classList.remove('active');
                collectionSwiper.prependSlide(`
                <div class="swiper-slide">
                    <button class="thumbnail">
                        <img src="${thumbnailSrc}" alt="thumbnail">
                    </button>
                </div>
                `);
                collectionSwiper.slideTo(0, 0);
            }

            thumbnailFixedPosition();
            collectionSlideMoving();
            addToListItems();
        });
    });
}

researchContentClickEvent();

function openMoodBoard() {
    var btn = document.getElementById('moodBoardOpenBtn');
    btn.addEventListener('click', function () {
        openModalPopup('moodBoardPopup');
        setTimeout(() => {
            createMoodBoardItemList();
        }, 250);
    });
}

openMoodBoard();

function closeMoodBoard() {
    var btn = document.getElementById('moodBoardCloseBtn');
    btn.addEventListener('click', function () {
        closeModalPopup('moodBoardPopup');
    });
}

closeMoodBoard();

function openModalPopup(target) {
    var elem = document.getElementById(target);
    var html = document.getElementsByTagName('html');
    elem.style.display = "block";
    html[0].style.overflowY = "hidden";
}

function closeModalPopup(target) {
    var elem = document.getElementById(target);
    var html = document.getElementsByTagName('html');
    elem.style.display = "none";
    html[0].style.overflowY = "auto";
}

function createMoodBoardItemList() {
    var collectionSlideList = document.querySelectorAll('.research-collection-area .swiper-slide');
    var imgSrc;
    var listHtml = '';
    var moodBaordListWrapper = document.getElementById('moodBoardListArea');
    collectionSlideList.forEach(function (item, idx) {
        imgSrc = item.querySelector('img').getAttribute('src');
        listHtml += `
            <li class="modal-thumbnail-list-con">
                <div class="modal-thumbnail-list-inner">
                    <button class="modal-thumbnail"><img src="${imgSrc}" alt="thumbnail" id="moodBoardThumbnail-${idx}" draggable="true" ondragstart="moodBoardListDragStart(event)" ondragend="moodBoardListDragEnd(event)"></button>
                </div>
            </li>
        `;
    });
    moodBaordListWrapper.innerHTML = listHtml;
    let magicGrid = new MagicGrid({
        container: "#moodBoardListArea",
        static: true,
        animate: false,
        gutter: 0
    });

    imagesLoaded('#moodBoardListArea', function () {
        magicGrid.listen();
    });
}

createMoodBoardItemList();

function moodBoardListDragStart(event) {
    event.dataTransfer.setData('text/plan', event.target.id);

    var deleteDropZone = document.getElementById('moodBoardDeleteZone').closest('.modal-bottom-button-wrap');
    deleteDropZone.style.display = 'block';
}

function moodBoardListDragEnd(event) {
    var deleteDropZone = document.getElementById('moodBoardDeleteZone').closest('.modal-bottom-button-wrap');
    deleteDropZone.style.display = 'none';
}

function moodBoardListDragOver(event) {
    event.preventDefault();
}

function moodBoardListOnDrop(event) {
    var id = event.dataTransfer.getData('text/plan');
    var elDraggable = document.getElementById(id);
    var elDropzone = event.target;

    elDraggable.closest('.modal-thumbnail-list-con').remove();
    let magicGrid = new MagicGrid({
        container: "#moodBoardListArea",
        static: true,
        animate: false,
        gutter: 0
    });

    imagesLoaded('#moodBoardListArea', function(){
        magicGrid.listen();
    });

    event.dataTransfer.clearData();
}
var mobileFilter = "win16|win32|win64|mac";
if (navigator.platform) {
    if (0 > mobileFilter.indexOf(navigator.platform.toLowerCase())) {
        function touchHandler(event) {
            var touches = event.changedTouches,
                first = touches[0],
                type = "";

            switch (event.type) {
                case "touchstart": type = "mousedown"; break;
                case "touchmove": type = "mousemove"; break;
                case "touchend": type = "mouseup"; break;
                default: return;
            }
            var simulatedEvent = document.createEvent("MouseEvent");
            simulatedEvent.initMouseEvent(type, true, true, window, 1,
                first.screenX, first.screenY,
                first.clientX, first.clientY, false,
                false, false, false, 0/*left*/, null);

            first.target.dispatchEvent(simulatedEvent);
            event.preventDefault();
        }

        function init() {
            document.addEventListener("touchstart", touchHandler, true);
            document.addEventListener("touchmove", touchHandler, true);
            document.addEventListener("touchend", touchHandler, true);
            document.addEventListener("touchcancel", touchHandler, true);
        }
    }
}