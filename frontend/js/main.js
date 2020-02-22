const heart = document.querySelector('.heart_btn');
const header = document.querySelector('#header');
const sidebox = document.querySelector('.side_box');
const variableWidth = document.querySelectorAll('.contents_box .contents');
const delegation = document.querySelector('.contents_box');

function delegrationFunc(e){
    let ele = e.target;

    console.log(ele)

    while(!ele.getAttribute('data-name')){
        ele = ele.parentNode;

        if(ele.nodeName === 'BODY'){
            ele = null;
            return
        }
    }

    let pk = ele.getAttribute('name')
    if(ele.matches('[data-name="heartbeat"]')){
        $.ajax({
            type: 'GET',
            url: 'data/like.json',
            data: {pk},
            dataType:'json',
            success: function(response){
                let likeCount = document.querySelector('#like-count-37');
                likeCount.innerHTML = '좋아요' + response.like_count + '개';
            },
            errir: function(request, status, error){
                alert('로그인이 필요합니다.'),
                window.location.replace('https://www.naver.com');
            }
        })
    }else if(ele.matches('[data-name="bookmark"]')){
        $.ajax({
            type: 'GET',
            url:'data/bookmark.json',
            data: {pk},
            dataType: 'json',
            success: function(response){
                let bookmarkCount = document.querySelector('#bookmark-count-37');
                bookmarkCount.innerHTML = '북마크' + response.bookmark_count + '개';
            }
        })
    }else if(ele.matches('[data-name="comment"')){
        let content = document.querySelector('#add-comment-post-37 > input[type=text]').value;
        console.log(content)

        if(content.length > 140){
            alert('댓글은 최대 140자 입력가능하빈다. 현재 글자수 : ' + content.length);
            return 
        }

        $.ajax({
            type: 'GET',
            url: './comment.html',
            data:{
                'pk': 37,
                'content': content,
            },
            dataType:'html',
            success:function(data){
                document.querySelector('#comment-list-ajax-post-37').insertAdjacentHTML('afterbegin', data);
            },
            error:function(request, status, error){
                alert('문제가 발생했습니다.');
            }
        })

        document.querySelector('#add-comment-post-37 > input[type=text]').value = ''

    }else if(ele.matches('[data-name="comment_delete"]')){
        $.ajax({
            type: 'GET',
            url: 'data/delete.json',
            data: {
                'pk':37,
            },
            dataType: 'json',
            success: function(response){
                if(response.status){
                    let comt = document.querySelector('.comment-detail');
                    comt.remove()
                }
            }
        })
    }else if(ele.matches('[data-name="follow"]')){
        $.ajax({
            type: 'GET',
            url: 'data/follow.json',
            data: {
                'pk': 37
            },
            dataType: 'json',
            success:function(response){
                if(response.status){
                    document.querySelector('input.follow').value = '팔로잉';
                }else{
                    document.querySelector('input.follow').value = '팔로워';
                }
            },
            error: function(request, status, error){
                alert('문제가 발생했습니다.')
                window.location.replace('https://www.naver.com')
            }
        })
    }

    ele.classList.toggle('on');
}

function resizeFunc(){
    if(pageYOffset >= 10){
        let calcWidth = window.innerWidth * 0.5 + 167;
        sidebox.style.left = calcWidth + 'px';
    }

    if(matchMedia('screen and (max-width : 800px').matches){
        for(let i=0; i <variableWidth.length; i++ ){
            variableWidth[i].style.left = window.innerWidth - 20 + 'px';
        }
    }else{
        for(let i=0; i < variableWidth.length; i++){
            if(window.innerWidth > 600){
                variableWidth[i].removeAttribute('style');
            }
        }   
    }
}

function scrollFunc(){
    let scrollHeight = pageYOffset + window.innerHeight;
    let documentHeight = document.body.scrollHeight;

     if(pageYOffset >= 10){
        header.classList.add('on')

        if(sidebox){
            sidebox.classList.add('on')
        }

        resizeFunc();
     }else{
         header.classList.remove('on')
         
         if(sidebox){
            sidebox.classList.remove('on')
            sidebox.removeAttribute('style')
         }
     }

     if (scrollHeight >= documentHeight){
         let page = document.querySelector('#page').value;
        
         document.querySelector('#page').value = parseInt(page) + 1
         callMorePostAjax(page);

         if (page > 5){
            return;
         }
     }
}

function callMorePostAjax(page){
    if (page > 5){
        return;
     }

    $.ajax({
        type: 'GET',
        url: './post.html',
        data: {
            'page': page
        },
        dataType: 'html',
        success: addMorePostAjax,
        error: function(request, status, error){
            alert('문제가 발생했습니다.!')
            window.location.replace('https://www.naver.com')
        }
    })
}

function addMorePostAjax(data){
    delegation.insertAdjacentHTML('beforeend', data)
}

setTimeout(function(){
    scrollTo(0,0)
}, 100)

if(delegation){
    delegation.addEventListener('click', delegrationFunc);
}
window.addEventListener('resize', resizeFunc);
window.addEventListener('scroll', scrollFunc);