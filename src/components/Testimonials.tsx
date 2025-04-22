
import { StarIcon } from "lucide-react";

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

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full mb-4">
            <span className="text-sm font-medium">Depoimentos</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Veja o que nossos <span className="text-transparent bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text">usuários</span> dizem
          </h2>
          <p className="text-lg text-gray-700">
            Milhares de pessoas já transformaram sua vida financeira com o MoMoney. Veja alguns relatos!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                {Array(testimonial.rating).fill(null).map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <blockquote className="text-gray-700 italic mb-6">"{testimonial.quote}"</blockquote>
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author} 
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
