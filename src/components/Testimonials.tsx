
import { StarIcon } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "O MoMoney mudou minha relação com o dinheiro! Finalmente consigo poupar sem sentir que estou fazendo sacrifícios.",
    author: "Ana Silva",
    title: "Designer, 32 anos",
    avatar: "https://i.pravatar.cc/150?img=32",
    rating: 5
  },
  {
    quote: "Com as sugestões personalizadas do assistente, consegui economizar 30% do meu salário em seis meses, algo que nunca imaginei ser possível.",
    author: "Roberto Martins",
    title: "Engenheiro, 28 anos",
    avatar: "https://i.pravatar.cc/150?img=59",
    rating: 5
  },
  {
    quote: "A visualização clara das minhas finanças me ajudou a identificar onde estava gastando demais e a tomar decisões melhores.",
    author: "Carla Ferreira",
    title: "Professora, 41 anos",
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 5
  }
];

const cardVariants = {
  offscreen: {
    opacity: 0,
    y: 50
  },
  onscreen: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: [0.4, 0.0, 0.2, 1]
    }
  })
};

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-40"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full mb-4">
            <span className="text-sm font-medium">Depoimentos</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Veja o que nossos <span className="gradient-text">usuários</span> dizem
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Milhares de pessoas já transformaram sua vida financeira com o MoMoney. Veja alguns relatos!
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              custom={index}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, margin: "-50px" }}
              variants={cardVariants}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                {Array(testimonial.rating).fill(null).map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <blockquote className="text-gray-700 dark:text-gray-300 italic mb-6">"{testimonial.quote}"</blockquote>
              <div className="flex items-center">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 rounded-full border-2 border-blue-300 dark:border-blue-600 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div>
                  <p className="font-semibold dark:text-white">{testimonial.author}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <p className="text-xl font-medium mb-4 gradient-text">
            Junte-se a milhares de usuários satisfeitos
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Confiança", "Inovação", "Precisão", "Segurança", "Suporte 24/7"].map((tag, i) => (
              <span 
                key={i} 
                className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
