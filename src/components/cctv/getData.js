export default {
  async loadHuya() {
    const me = this
    const vm = me.$root
    let page = 0
    let result = []
    let isBreak = false

    while (!isBreak) {
      await new Promise((next) => {
        $.getJSON('https://www.huya.com/cache.php?m=LiveList&do=getLiveListByPage&gameId=2135&tagAll=0&page=' + (++page), (data) => {
          const list = data.data.datas
          console.log('load succ ', page)
          result = result.concat(list.map((v) => {
            return {
              id: v.profileRoom,
              title: v.roomName.replace(/┊/g, '').trim(),
              img: v.screenshot,
            }
          }))
          isBreak = list.length < 120
          next()
        })
      })
    }

    const jsonNoRepeat = {}
    for (let i = 0; i < result.length; i++) {
      const item = result[i]
      if (jsonNoRepeat[item.id]) {
        result.splice(i, 1)
        i--
        continue
      }
      jsonNoRepeat[item.id] = 1
    }

    const arr = Array.from(result)

    await Promise.all(Array(15).fill().map((v) => {
      return new Promise(async (next) => {
        while (arr.length > 0) {
          const item = arr.shift()
          await new Promise((next) => {
            $.ajax({
              method: 'GET',
              url: 'https://m.huya.com/' + item.id,
              success(sHtml) {
                $(sHtml).find('video').each((idx, video) => {
                  item.m3u8 = video.src
                })
                console.log('m3u8 load succ', item.title, arr.length)
                next()
              },
              error() {
                next()
              },
            })
          })
        }
        next()
      })
    }))

    result.splice(1, 0, {
      "id": "11352975",
      "title": "【贝爷】史上最强男人",
      "img": "//live-cover.msstatic.com/huyalive/30765679-2523417602-10837996074740744192-2847699224-10057-A-0-1/20191209174557.jpg?x-oss-process=image/resize,limit_0,m_fill,w_338,h_190/sharpen,80/format,webp/quality,q_90",
      "m3u8": "https://aldirect.hls.huya.com/backsrc/30765679-2523417602-10837996074740744192-2847699224-10057-A-0-1_1200.m3u8?wsSecret=b63444d74bbb97b5140b580f2e636f3a&wsTime=5dee17f0"
    })

    console.log('----------------')
    console.log(result.length)
    result = result.filter(v => v.m3u8)
    console.log(result)
    console.log(JSON.stringify(result))
    console.log(result.length)
  },
  async loadChannel() {
    const mapChannel = {}
    let listAlbum = []
    let isBreak = false
    let page = 0

    while (!isBreak) {
      await new Promise((next) => {
        $.getJSON('https://api.cntv.cn/lanmu/columnSearch?&fl=&fc=&cid=&p=' + (++page) + '&n=100&serviceId=tvcctv&t=jsonp&cb=?', (data) => {
          data = ((data || {}).response || {}).docs || []
          listAlbum = listAlbum.concat(data.map((v) => {
            return {
              name: v.column_name,
              cName: v.channel_name,
              site: (v.lastVIDE || {}).videoUrl || '',
            }
          }))
          isBreak = data.length < 100
          next()
        })
      })
    }

    listAlbum.forEach((v) => {
      mapChannel[v.cName] = mapChannel[v.cName] || []
      mapChannel[v.cName].push(v)
      delete v.cName
    })

    await Promise.all(Array(20).fill().map(() => {
      return new Promise(async (next) => {
        while (listAlbum.length > 0) {
          const item = listAlbum.shift()
          if (!item.site) continue
          await new Promise((next) => {
            $.get(item.site, (sHtml) => {
              item.id = sHtml.match(/(?:")(TOPC\d+)(?:")/)[1]
              delete item.site
              console.log(item.name, item.id, listAlbum.length)
              next()
            })
          })
        }
        next()
      })
    }))

    const channel = Object.keys(mapChannel).sort((a, b) => {
      return a.match(/\d+/)[0] - b.match(/\d+/)[0]
    }).map((k) => {
      return {
        name: k,
        children: mapChannel[k]
      }
    })

    console.clear()
    console.log(channel)
    console.log(JSON.stringify(channel))
    console.log(listAlbum.length)
  },
  async getVideoList() {
    const me = this
    const vm = me.$root
    const r = vm.router
    const searchText = me.searchText
    const signGetVideoList = vm.signGetVideoList = Math.random()

    me.video.group = []
    $('.video-group .list-item .inner').css({backgroundImage: ''})

    const finish = (listGroup) => {
      $('.video-group .list-item .inner').css({backgroundImage: ''})
      me.video.group = listGroup
      me.isIndex && (me.cache[me.tabCom] = listGroup)
      vm.is.loading = false
      vm.lazyLoad(1)
      const el = me.$refs.autoScroll
      el && (el.scrollTop = 0)
    }

    if (me.isIndex && me.cache[r.tabCom]) {
      finish(me.cache[r.tabCom])
      return
    }

    vm.is.loading = true
    await sleep(150)

    if (signGetVideoList !== vm.signGetVideoList) {
      // console.warn('getVideoList 防重复加载')
      return
    }

    const dataGroup = await new Promise(async (next) => {
      if (searchText) {
        if (/^https?/.test(searchText)) {
          // 通过网址搜索
          next(await me.getVideoListByUrl(searchText))
        } else {
          // 通过关键字搜索
          next(await me.getVideoListBySearch())
        }
      } else {
        if (r.idxChannel === undefined && r.idxAlbum === undefined) {
          // 加载央视首页
          switch (me.tabCom) {
            case '频道直播':
              $.getJSON('./static-codding/data/liveChannel.json?t=' + ~~(new Date().getMinutes() / 10), (data) => {
                me.page.total = data.length || 0
                next([{
                  title: '全部视频：共' + me.page.total + '条',
                  list: data,
                }])
              })
              break
            case '官方首页':
              next(await me.getVideoListByUrl('http://tv.cctv.com/'))
              break
            case '专题直播':
              $.getJSON('./static-codding/data/liveHuya.json?t=' + ~~(new Date().getMinutes() / 10), (data) => {
                me.page.total = data.length || 0
                data.forEach((item, idx, arr) => {
                  item.site = 'https://www.huya.com/' + item.id
                })
                next([{
                  title: '全部直播：共' + me.page.total + '条',
                  list: data,
                }])
              })
              break
            case '4K专区':
              let page = 0
              let isBreak = false
              let listResult = []
              
              while (!isBreak) {
                await new Promise((next) => {
                  $.getJSON('http://api.cntv.cn/video/getVideoList4k?serviceId=cctv4k&p=' + (++page) + '&n=30&t=jsonp&cb=?', (data) => {
                    const list = (data.data || {}).list || []

                    isBreak = list.length < 30
                    listResult = listResult.concat(list.map((v) => {
                      return {
                        id: '',
                        img: v.image,
                        title: v.title,
                        desc: '',
                        site: v.url,
                      }
                    }))

                    next()
                  })
                })
              }

              me.page.total = listResult.length || 0
              next([{
                title: '全部视频：共' + me.page.total + '条',
                list: listResult,
              }])
              break
          }
        } else {
          // 通过curAlbum.id加载
          $.getJSON('http://api.cntv.cn/lanmu/videolistByColumnId?id=' + me.curAlbum.id + '&n=100&of=fdate&p=' + (me.curPage + 1) + '&type=0&serviceId=tvcctv&cb=?&_=1575643753220', (data) => {
            const dataList = (((data || {}).response || {}).docs || []).map((v) => {
              return {
                id: (v.videoSharedCode || '').trim(),
                title: (v.videoTitle || '').trim(),
                desc: (v.videoBrief || '').trim(),
                site: (v.videoUrl || '').trim(),
                img: v.videoKeyFrameUrl || v.videoKeyFrameUrl2 || v.videoKeyFrameUrl3,
              }
            })

            me.page.total = data.response.numFound || 0
            next([{
              title: '全部视频：共' + me.page.total + '条',
              list: dataList,
            }])
          })
        }
      }
    })

    if ((vm.router.com !== 'cctv') || (signGetVideoList !== vm.signGetVideoList)) {
      // console.log('com not cctv')
      return
    }

    finish(dataGroup)
  },
  getVideoListByUrl(url) {
    const me = this
    const vm = me.$root

    return new Promise((next) => {
      $.get(vm.apiPrefix + 'get.php', {
        a: 'get',
        url,
      }, async (sHtml) => {
        let arr = []
        
        arr = arr.concat(Array.from($(sHtml).find('a')).filter(a => /tv\.cctv\.com\/\d{4}\/\d{2}\/\d{2}/.test(a.href)).map((a) => {
          const img = $(a).find('img')

          return {
            id: '',
            img: img.attr('data-src') || img.attr('lazy') || img.attr('src'),
            title: a.innerText,
            desc: '',
            site: a.href,
          }
        }))

        /*
          四个参数都有
          http://tv.cctv.com/2018/06/26/VIDECsJMIfpvWVBBkY90G5gC180626.shtml?spm=C55924871139.PKgX4CXWWE68.0.0
        */
        /*
          http://tv.cctv.com/2013/11/11/VIDE1384138308251702.shtml
          itemid1- VIDETG6cuxDImU2Y5IqvNfCh190816
          column_id- TOPC1451558858788377
        */
        const itemid1 = sHtml.match_(/itemid1="([^"]+)"/)[1] || ''
        const column_id = sHtml.match_(/column_id = "([^"]+)"/)[1] || ''
        const videotvCodes = sHtml.match_(/videotvCodes="([^"]+)"/)[1] || ''
        const videoalbumId = videotvCodes.split(":")[0];
        /*console.clear()
        console.log('itemid1-', itemid1)
        console.log('column_id-', column_id)
        console.log('videotvCodes-', videotvCodes)
        console.log('videoalbumId-', videoalbumId)*/

        function mergeData(data) {
          const list = (data || {}).data || []
          arr = arr.concat(list.map((v) => {
            return {
              id: v.guid,
              img: v.video_key_frame_url,
              title: v.video_title,
              desc: '',
              site: v.video_url,
            }
          }))
        }

        if (videotvCodes || videoalbumId) {
          const url0 = 'http://api.cntv.cn/video/getVideoListByAlbumIdInfo?videoid=' + itemid1 + '&videoalbumid=' + videoalbumId + '&serviceId=tvcctv&type=0&t=jsonp&cb=setItem0=';
          const url1 = 'http://api.cntv.cn/video/getVideoListByAlbumIdInfo?videoid=' + itemid1 + '&videoalbumid=' + videoalbumId + '&serviceId=tvcctv&type=1&t=jsonp&cb=setItem1=';

          await new Promise((next) => {
            $.getScript(url0, () => {
              // console.log(window.setItem0, 'url0')
              mergeData(window.setItem0)
              next()
            })
          })
          await new Promise((next) => {
            $.getScript(url1, () => {
              // console.log(window.setItem1, 'url1')
              mergeData(window.setItem1)
              next()
            })
          })
        }

        if (itemid1 || column_id) {
          const url0 = 'http://api.cntv.cn/video/getVideoListByTopicIdInfo?videoid=' + itemid1 + '&topicid=' + column_id + '&serviceId=tvcctv&type=0&t=jsonp&cb=setItem0=';
          const url1 = 'http://api.cntv.cn/video/getVideoListByTopicIdInfo?videoid=' + itemid1 + '&topicid=' + column_id + '&serviceId=tvcctv&type=1&t=jsonp&cb=setItem1=';

          await new Promise((next) => {
            $.getScript(url0, () => {
              // console.log(window.setItem0, 'url0')
              mergeData(window.setItem0)
              next()
            })
          })
          await new Promise((next) => {
            $.getScript(url1, () => {
              // console.log(window.setItem1, 'url1')
              mergeData(window.setItem1)
              next()
            })
          })
        }

        const compereId = (sHtml.match_(/compereId="([^"]+)"/)[1] || '').trim()

        if (compereId) {
          await new Promise((next) => {
            $.getJSON('http://api.cntv.cn/list/getVideoListByActorId?id=' + compereId + '&p=1&n=10&serviceId=tvcctv&cb=?', (data) => {
              console.log('getVideoListByActorId', data)
              arr = arr.concat((data.data || []).map((v) => {
                return {
                  id: v.guid,
                  img: v.video_key_frame_url,
                  title: v.video_title,
                  desc: '',
                  site: v.video_url,
                }
              }))
              next()
            })
          })
        }

        arr = arr.concat(Array.from($(sHtml).find('a img')).filter((img) => {
          let href = $(img).closest('a').attr('href') || ''
          href.slice(0, href.indexOf('?'))
          return href.search(/tv\.cctv\.com\/\d{4}\/\d{2}\/\d{2}/) > -1
        }).map((img) => {
          let site
          let nodeText

          img = $(img)
          site = img.closest('a').attr('href')
          nodeText = img.closest('.image')
          nodeText = nodeText[0] ? nodeText.next() : img.closest('li, dd, .box, .item')
          return {
            id: '',
            img: img.attr('lazy') || img.attr('data-src') || img.attr('src'),
            title: nodeText.text(),
            desc: '',
            site,
          }
        }))

        // 网页js数据解析
        try {
          let _arr = sHtml.slice(sHtml.indexOf('var jsonData2=[{')).split(/\n/g).map(s => s.trim()).filter(v => v).join('')
          _arr = eval(_arr.match_(/\[\{.*?\}\]/)[0] || '[]')
          arr = arr.concat(_arr.map((v) => {
            return {
              id: '',
              img: v.img,
              title: v.title,
              desc: v.brief,
              site: v.url,
            }
          }))
        } catch (e) {}

        // 数据提纯
        let mapSite = {}
        arr = arr.filter(v => !v.img).concat(arr.filter(v => v.img))
        arr.forEach((v) => {
          for (let k in v) 
            v[k] = (v[k] || '').replace(/\s+/g, ' ').trim()
          mapSite[v.site] = v
        })
        arr = Object.keys(mapSite).map(site => mapSite[site])
        arr = arr.filter(v => v.img).concat(arr.filter(v => !v.img)).filter((v) => {
          return v.site !== 'http://tv.cctv.com/2016/03/02/ARTI2TjVLDkZ6tED7aJjMLtE160302.shtml'
        })

        // 检测网页中是否包含视频
        const videoId = (sHtml.match(/"videoCenterId","([^"]*)"/m) || sHtml.match(/(?:guid = ")(\w{32})(?:")/) || [])[1] || ''

        if (videoId) {
          me.video.info = {
            id: videoId,
            title: $(sHtml).find('title').html(),
            site: url,
          }
        } else {
          me.video.info = {
            id: '',
            title: '',
            site: '',
          }
        }

        me.page.total = arr.length || 0
        
        next([{
          title: '全部视频：共' + me.page.total + '条',
          list: arr,
        }])
      })
    })
  },
  async getVideoListBySearch() {
    const me = this
    const vm = me.$root
    const searchText = me.searchText
    const signGetVideoList = me.signGetVideoList
    const listGroup = []

    await new Promise((next) => {
      // 只在第一页加载group
      if (me.curPage !== 0) {
        next()
        return
      }

      $.get(vm.apiPrefix + 'get.php', {
        a: 'get',
        url: 'https://search.cctv.com/search.php?qtext=' + encodeURIComponent(searchText) + '&type=video'
      }, async (sHtml) => {
        const urls = sHtml.match_(/https:\/\/r\.img\.cctvpic\.com\/so\/cctv\/list[^"]*/g)

        for (let i = 0; i < urls.length; i++) {
          await new Promise((next) => {
            const src = urls[i]
            window.playlistArray = {}

            $.getScript(src, () => {
              if (signGetVideoList !== me.signGetVideoList) {
                return
              }

              Object.keys(playlistArray).forEach((k) => {
                const data = playlistArray[k]
                let list = data.video.recent

                list = (list || data.video).map((item) => {
                  item.title = decodeURIComponent(item.title)
                  return {
                    id: item.detailsid,
                    img: item.imagelink,
                    title: item.title,
                    desc: '',
                    site: item.targetpage,
                    keyId: Math.random(),
                  }
                })
                listGroup.push({
                  title: decodeURIComponent(data.playlist.title),
                  list
                })
              })

              // vm.is.loading = false
              vm.lazyLoad()
              next()
            })
          })
        }

        next()
      })
    })

    return new Promise(async (next) => {
      let listResult = []

      for (let i = 0; i < 5; i++) {
        const curPage = me.curPage * 5 + i + 1

        if (i > 0 && curPage > Math.ceil(me.page.total / 20)) break

        await new Promise((next) => {
          $.get(vm.apiPrefix + 'get.php', {
            a: 'get',
            url: 'https://search.cctv.com/ifsearch.php?'+
            'page=' + curPage + '&qtext=' + me.searchText + '&'+
            'sort=relevance&'+
            'pageSize=20&'+
            'type=video&'+
            'vtime=-1&'+
            'datepid=1&'+
            'channel=&'+
            'pageflag=1&'+
            'qtext_str=' + me.searchText,
          }, (data) => {
            if (signGetVideoList !== me.signGetVideoList) {
              // console.warn('时过境迁 getVideoListBySearch', searchText)
              return
            }

            data = JSON.parse(data)

            const list = data.list.map((item) => {
              if (/\/\w{32}-\d+\.\w+$/.test(item.imglink)) {
                const src = item.imglink || ''
                const rangeL = src.lastIndexOf('/') + 1
                const rangeR = src.search(/-\d+/)
                item.id = src.slice(rangeL, rangeR)
              } else {
                item.id = ''
              }

              try {
                item.all_title = decodeURIComponent(item.all_title)
              } catch (e) {}

              return {
                id: item.id,
                img: item.imglink,
                title: item.all_title,
                desc: '',
                site: item.urllink,
                keyId: Math.random(),
              }
            })

            me.page.total = data.total || 0
            listResult = listResult.concat(list)
            next()
          })
        })
      }

      listGroup.push({
        title: '全部视频：共' + me.page.total + '条',
        list: listResult,
      })
      next(listGroup)
    })
  },
}