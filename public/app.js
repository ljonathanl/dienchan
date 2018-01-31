

Vue.component('grid', {
    template: '#grid-template',
    props: {
      data: Array,
      columns: Array,
      names: Array,
      filterKey: String
    },
    data: function () {
      var sortOrders = {}
      this.columns.forEach(function (key) {
        sortOrders[key] = 1
      })
      return {
        sortKey: '',
        sortOrders: sortOrders
      }
    },
    computed: {
      filteredData: function () {
        var sortKey = this.sortKey
        var filterKey = this.filterKey && this.filterKey.toLowerCase()
        var order = this.sortOrders[sortKey] || 1
        var data = this.data
        if (filterKey) {
          data = data.filter(function (row) {
            return Object.keys(row).some(function (key) {
              return String(row[key]).toLowerCase().indexOf(filterKey) > -1
            })
          })
        }
        if (sortKey) {
          data = data.slice().sort(function (a, b) {
            a = a[sortKey]
            b = b[sortKey]
            return (a === b ? 0 : a > b ? 1 : -1) * order
          })
        }
        return data
      }
    },
    filters: {
      capitalize: function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1)
      },
    },
    methods: {
      sortBy: function (key) {
        this.sortKey = key
        this.sortOrders[key] = this.sortOrders[key] * -1
      },
      emphasize: function (str) {
        return this.filterKey && this.filterKey.length > 1 ? str.replace(new RegExp(this.filterKey, 'gi'), '<em>$&</em>') : str; 
      }
    }
  })

Vue.component('list', {
    template: '#list-template',
    props: {
      list: Array,
      name: String,
      value: String
    },
    methods: {
      select: function() {
        this.$emit('input', this.$refs.select.value)
      }
    }
})

new Vue({
    el: '#app',
    data: {
        searchQuery: '',
        gridColumns: ['point', 'zones', 'effects', 'indications', 'contraindications'],
        gridColumnNames: ['point', 'zones', 'effets', 'indications', 'contre-indications'],
        gridData: points,
        zonesList: zonesList,
        effectsList: effectsList,
        indicationsList: indicationsList,
        selects: [
          {name:'Zones', list: zonesList, value: "", points: zones},
          {name:'Effets', list: effectsList, value: "", points: effects},
          {name:'Indications', list: indicationsList, value: "", points: indications},
        ]
    },
    methods: {
      filter: function(select) {
        if (select && select.value) {
          let selectedPoints = select.points[select.value]
          this.gridData = points.filter(point => {
            return selectedPoints.indexOf(point.point) >= 0;
          })
        } else {
          this.gridData = points
        }
        this.selects.forEach(item => {
          if (item != select) {
            item.value = ""
          }
        })
      }
    }
})
