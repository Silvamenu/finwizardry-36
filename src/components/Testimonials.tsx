
import { StarIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

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
  onscreen: {
    opacity: 1,
    y: 0
  }
};

const Testimonials = () => {
  const { t } = useTranslation();
  
  return (
    <section id="testimonials" className="py-20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-accent-start/10 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent-end/5 rounded-full blur-3xl opacity-40"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-3 py-1.5 bg-accent-start/10 text-accent-start rounded-full mb-4">
            <span className="text-sm font-medium">{t('testimonials.title', 'Depoimentos')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-text-highlight">
            {t('testimonials.heading_start', 'Veja o que nossos')}{' '}
            <span className="bg-gradient-to-r from-accent-start to-accent-end bg-clip-text text-transparent">{t('testimonials.heading_highlight', 'usuários')}</span>{' '}
            {t('testimonials.heading_end', 'dizem')}
          </h2>
          <p className="text-lg text-text-primary">
            {t('testimonials.description', 'Milhares de pessoas já transformaram sua vida financeira com o FinWizardry. Veja alguns relatos!')}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, margin: "-50px" }}
              variants={cardVariants}
              transition={{
                delay: index * 0.2,
                duration: 0.8,
                ease: [0.4, 0.0, 0.2, 1]
              }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 25px -5px rgba(104, 63, 234, 0.1), 0 10px 10px -5px rgba(104, 63, 234, 0.08)"
              }}
              className="bg-background-card border border-white/10 rounded-2xl p-8 shadow-lg transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                {Array(testimonial.rating).fill(null).map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <blockquote className="text-text-primary italic mb-6">"{testimonial.quote}"</blockquote>
              <div className="flex items-center">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 rounded-full border-2 border-accent-start opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div>
                  <p className="font-semibold text-text-highlight">{testimonial.author}</p>
                  <p className="text-sm text-text-primary">{testimonial.title}</p>
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
          <p className="text-xl font-medium mb-4 bg-gradient-to-r from-accent-start to-accent-end bg-clip-text text-transparent">
            {t('testimonials.join_users', 'Junte-se a milhares de usuários satisfeitos')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              t('testimonials.tag_trust', 'Confiança'), 
              t('testimonials.tag_innovation', 'Inovação'), 
              t('testimonials.tag_accuracy', 'Precisão'), 
              t('testimonials.tag_security', 'Segurança'), 
              t('testimonials.tag_support', 'Suporte 24/7')
            ].map((tag, i) => (
              <span 
                key={i} 
                className="px-4 py-2 bg-accent-start/10 text-accent-start rounded-full text-sm font-medium"
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
