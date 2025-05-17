// @ts-ignore
const { eventSource } = SillyTavern.getContext();

function updateOrCreateZoomedAvatar(imgSrc) {
    let zoomedAvatarDiv = document.querySelector('.zoomed_avatar.draggable');
    if (zoomedAvatarDiv) {
        let zoomedImage = zoomedAvatarDiv.querySelector('.zoomed_avatar_img');
        if (zoomedImage) {
            zoomedImage.setAttribute('src', imgSrc);
            zoomedImage.setAttribute('data-izoomify-url', imgSrc);
        }
        zoomedAvatarDiv.setAttribute('forchar', imgSrc);
        zoomedAvatarDiv.setAttribute('id', `zoomFor_${imgSrc}`);
        let dragGrabber = zoomedAvatarDiv.querySelector('.drag-grabber');
        if (dragGrabber) {
            dragGrabber.setAttribute('id', `zoomFor_${imgSrc}header`);
        }
    } else {
        zoomedAvatarDiv = document.createElement('div');
        zoomedAvatarDiv.className = 'zoomed_avatar draggable';
        zoomedAvatarDiv.setAttribute('forchar', imgSrc);
        zoomedAvatarDiv.setAttribute('id', `zoomFor_${imgSrc}`);
        zoomedAvatarDiv.setAttribute('style', 'display: flex;');
        zoomedAvatarDiv.innerHTML = `
            <div class="panelControlBar flex-container">
                <div class="fa-fw fa-solid fa-grip drag-grabber" id="zoomFor_${imgSrc}header"></div>
                <div class="fa-fw fa-solid fa-circle-xmark dragClose" id="closeZoom"></div>
            </div>
            <div class="zoomed_avatar_container">
                <img class="zoomed_avatar_img" src="${imgSrc}" data-izoomify-url="${imgSrc}" data-izoomify-magnify="1.8" data-izoomify-duration="300" alt="">
            </div>
        `;
        document.body.appendChild(zoomedAvatarDiv);
    }
}

function ensureZoomedAvatarExists(imgSrc) {
    if (zoomedAvatarObserver) zoomedAvatarObserver.disconnect();
    zoomedAvatarObserver = new MutationObserver(() => {
        if (!document.querySelector('.zoomed_avatar.draggable')) {
            updateOrCreateZoomedAvatar(imgSrc);
        }
    });
    zoomedAvatarObserver.observe(document.body, { childList: true, subtree: true });
}

function UserZoom() {
    const selectedAvatar = document.querySelector('.avatar-container.selected');
    if (selectedAvatar) {
        const imgElement = selectedAvatar.querySelector('img');
        if (imgElement) {
            const imgSrc = imgElement.getAttribute('src');
            if (imgSrc) {
                updateOrCreateZoomedAvatar(imgSrc);
                ensureZoomedAvatarExists(imgSrc)
            }
        }
    }
}

function CharZoom() {
    const lastCharMsg = document.querySelector('.last_mes[is_user="false"]');
    if (lastCharMsg) {
        const charName = lastCharMsg.getAttribute('ch_name');
        if (charName) {
            const imgSrc = `/characters/${charName}.png`;
            updateOrCreateZoomedAvatar(imgSrc);
            ensureZoomedAvatarExists(imgSrc)
        }
    }
}

let zoomedAvatarObserver = null;

// ONLY MODIFIED SECTION: Remove user avatar triggers
eventSource.on('generation_started', CharZoom);
