(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = [] //用來放置所有電影資料
  const dataPanel = document.getElementById('data-panel')

  axios.get(INDEX_URL).then((response) => {
    data.push(...response.data.results)


    getPageData(1, data)
    //
    getTotalPages(data)
  }).catch((err) => console.log(err))


  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id)
    }
  })

  function displayDataList(data, patternType) {
    let htmlContent = ""
    if (patternType === "card" || typeof (patternType) === "undefined") {
      data.forEach(item => {
        htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button> 
              <!-- favorite button -->
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button> 
            </div>
          </div>     
        </div>
      `
      })
    }
    else if (patternType === "list") {
      data.forEach(item => {
        htmlContent += `
          <table class="table table-hover">
            <thead></thead>
            <tbody>
              <tr>
                <td>${item.title}</td>
                <td class="text-right">            
                  <!-- "More" button -->
                  <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
                  <!-- favorite button --> 
                  <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
                </td>
              </tr>
            </tbody>
          </table>
        `;
      });
    }


    dataPanel.innerHTML = htmlContent
  }

  function showMovie(id) {

    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    const url = INDEX_URL + id
    console.log(url)

    axios.get(url).then(response => {
      const data = response.data.results

      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }

  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')
  searchForm.addEventListener('submit', event => {
    event.preventDefault()
    let input = searchInput.value.toLowerCase()
    let results = data.filter(
      movie => movie.title.toLowerCase().includes(input)
    )
    getTotalPages(results)
    getPageData(1, results)
  })
  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))
    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }
  pagination.addEventListener('click', event => {
    if (event.target.tagName === 'A') {
      //點擊某分頁，透過客製化的data-page標籤找到該頁碼並傳入 getPageData function
      getPageData(event.target.dataset.page)
    }
  })
  let paginationData = []
  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }
  let patternType = ""
  const viewChange = document.querySelector('.view-change')
  viewChange.addEventListener('click', (event) => {
    if (event.target.matches(".fa-bars")) {
      patternType = "list"
    } else if (event.target.matches("fa-th")) {
      patternType = "card"
    }
    displayDataList(pageData, patternType)
  })

})()