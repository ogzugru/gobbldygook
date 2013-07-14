from major import Major

class Concentration(Major):
	def __init__(self, dept="NONE"):
		super().__init__(dept, path="concentrations/")

if __name__ == '__main__':
	tmp = [
		Concentration(dept="Asian")
	]
	for i in tmp:
		print(i)
