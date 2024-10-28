// categoriaService.js
import axios from 'axios'

export default {
    async fetchCategorias(pageNum = 1) {
        try {
            const response = await axios.get(`/api/page/${pageNum}`)
            return response.data.content
        } catch (error) {
            console.error('Error fetching categories:', error)
            return []
        }
    }
}